package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.indexing.core.IndexedObject;
import applica.framework.library.dynaobject.BaseDynamicObject;
import applica.framework.library.dynaobject.DynamicObject;
import applica.framework.library.dynaobject.Property;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.lang.StringUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.NIOFSDirectory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LuceneIndexService implements IndexService {

    public static final String KEY_FIELD = "__id";

    @Autowired
    private IndexerFactory indexerFactory;

    @Autowired
    private OptionsManager options;

    private StandardAnalyzer analyzer;
    private Directory directory;
    private IndexWriter indexWriter;
    private SearcherManager searcherManager;

    private ExecutorService executorService = Executors.newFixedThreadPool(10);

    @PostConstruct
    private void init() throws IOException, URISyntaxException {
        String path = options.get("applica.framework.indexing.lucene.data.path");
        if (StringUtils.isEmpty(path)) {
            throw new RuntimeException("Please set applica.framework.indexing.lucene.data.path");
        }


        analyzer = new StandardAnalyzer();
        directory =  new NIOFSDirectory(Paths.get(new URI(path)));
        indexWriter = new IndexWriter(directory, new IndexWriterConfig(analyzer));
        searcherManager = new SearcherManager(indexWriter, true, true, null);
    }

    @Override
    public void index(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");

        executorService.execute(() -> {
            IndexedObject indexedObject = indexerFactory
                    .create((Class<Entity>) entity.getClass())
                    .map(i -> i.index(entity))
                    .orElse(null);

            if (indexedObject != null) {
                try {
                    Document document = createDocument(indexedObject);

                    if (documentExists(indexedObject.getUniqueId())) {
                        indexWriter.updateDocument(new Term(KEY_FIELD, indexedObject.getUniqueId()), document);
                    } else {
                        indexWriter.addDocument(document);
                    }

                    searcherManager.maybeRefresh();
                    indexWriter.commit();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    @Override
    public void remove(String uniqueId) {
        executorService.execute(() -> {
            if (StringUtils.isNotEmpty(uniqueId)) {
                try {
                    indexWriter.deleteDocuments(new Term(KEY_FIELD, uniqueId));
                    searcherManager.maybeRefresh();
                    indexWriter.commit();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    private boolean documentExists(String uniqueId) throws IOException {
        IndexSearcher searcher = searcherManager.acquire();
        TopDocs search = searcher.search(new TermQuery(new Term(KEY_FIELD, uniqueId)), 1);
        searcherManager.release(searcher);

        return search.totalHits > 0;
    }

    private Document createDocument(IndexedObject indexedObject) {
        Document document = new Document();

        document.add(new StringField(KEY_FIELD, indexedObject.getUniqueId(), Field.Store.YES));

        for (Property property : indexedObject.getProperties()) {
            if (property.getValue() != null) {
                document.add(new StringField(property.getKey(), String.valueOf(property.getValue()), Field.Store.YES));
            }
        }

        return document;
    }

    @Override
    public <T extends Entity> List<IndexedObject> search(Class<T> entityType, Query query) {
        List<IndexedObject> result = new ArrayList<>();

        try {
            IndexSearcher searcher = searcherManager.acquire();

            org.apache.lucene.search.Query luceneQuery = buildLuceneQuery(query);
            TopDocs luceneResult = searcher.search(luceneQuery, 50);

            for (ScoreDoc scoreDoc : luceneResult.scoreDocs) {
                Document document = searcher.doc(scoreDoc.doc);
                result.add(createDynamicObject(document));
            }

            searcherManager.release(searcher);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return result;
    }

    private IndexedObject createDynamicObject(Document document) {
        IndexedObject dynamicObject = new IndexedObject();

        for (IndexableField indexableField : document.getFields()) {
            dynamicObject.setProperty(indexableField.name(), indexableField.stringValue());
            if (indexableField.name().equals(KEY_FIELD)) {
                dynamicObject.setUniqueId(indexableField.stringValue());
            }
        }

        return dynamicObject;
    }

    private org.apache.lucene.search.Query buildLuceneQuery(Query query) throws ParseException {
        StringBuilder queryString = new StringBuilder();

        QueryParser parser = new QueryParser(KEY_FIELD, analyzer);
        if (StringUtils.isNotEmpty(query.getKeyword())) {
            queryString.append(query.getKeyword());
        } else {
            query.getFilters().forEach(f -> queryString.append(f.getProperty()).append(":").append(f.getValue()).append(" "));
        }

        return parser.parse(queryString.toString());
    }

}
