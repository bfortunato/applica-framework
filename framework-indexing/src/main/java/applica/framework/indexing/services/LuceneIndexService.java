package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.indexing.core.IndexedObject;
import applica.framework.indexing.core.IndexedResult;
import applica.framework.library.dynaobject.Property;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.lang.StringUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
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
import java.util.Date;
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
    public <T extends Entity> void index(T entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");

        executorService.execute(() -> {
            IndexedObject indexedObject = indexerFactory
                    .create((Class<T>) entity.getClass())
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
                if (Double.class.equals(property.getValue().getClass())) {
                    document.add(new DoublePoint(property.getKey(), (Double) property.getValue()));
                } else if (Float.class.equals(property.getValue().getClass())) {
                    document.add(new FloatPoint(property.getKey(), (Float) property.getValue()));
                } else if (Long.class.equals(property.getValue().getClass())) {
                    document.add(new LongPoint(property.getKey(), (Long) property.getValue()));
                } else if (Integer.class.equals(property.getValue().getClass())) {
                    document.add(new IntPoint(property.getKey(), (Integer) property.getValue()));
                } else if (Boolean.class.equals(property.getValue().getClass())) {
                    document.add(new IntPoint(property.getKey(), ((Boolean) property.getValue()) ? 1 : 0));
                } else if (Date.class.equals(property.getValue().getClass())) {
                    document.add(new LongPoint(property.getKey(), ((Date) property.getValue()).getTime()));
                } else {
                    document.add(new StringField(property.getKey(), String.valueOf(property.getValue()), Field.Store.YES));
                }
            }
        }

        return document;
    }

    @Override
    public <T extends Entity> IndexedResult search(Class<T> entityType, Query query) {
        List<IndexedObject> result = new ArrayList<>();
        int totalResults = 0;

        try {
            IndexSearcher searcher = searcherManager.acquire();

            org.apache.lucene.search.Query luceneQuery = buildLuceneQuery(query);
            TopScoreDocCollector collector = TopScoreDocCollector.create(1000);
            searcher.search(luceneQuery, collector);

            int startIndex = 0;
            int numHits = 1000;

            if (query.getPage() > 0 && query.getRowsPerPage() > 0) {
                startIndex = (query.getPage() - 1) * query.getRowsPerPage();
                numHits = query.getRowsPerPage();
            }

            TopDocs topDocs = collector.topDocs(startIndex, numHits);
            totalResults = collector.getTotalHits();

            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                Document document = searcher.doc(scoreDoc.doc);
                result.add(createDynamicObject(document));
            }

            searcherManager.release(searcher);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return new IndexedResult(result, totalResults);
    }

    private IndexedObject createDynamicObject(Document document) {
        IndexedObject dynamicObject = new IndexedObject();

        for (IndexableField indexableField : document.getFields()) {
            if (DoublePoint.class.equals(indexableField.getClass())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().doubleValue());
            } else if (FloatPoint.class.equals(indexableField.getClass())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().floatValue());
            } else if (Long.class.equals(indexableField.getClass())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().longValue());
            } if (IntPoint.class.equals(indexableField.getClass())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().intValue());
            } else {
                dynamicObject.setProperty(indexableField.name(), indexableField.stringValue());
            }

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
