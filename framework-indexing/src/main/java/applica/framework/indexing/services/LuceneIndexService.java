package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.indexing.core.*;
import applica.framework.library.dynaobject.Property;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.lang.StringUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.flexible.core.QueryNodeException;
import org.apache.lucene.queryparser.flexible.standard.StandardQueryParser;
import org.apache.lucene.queryparser.flexible.standard.config.PointsConfig;
import org.apache.lucene.queryparser.flexible.standard.config.StandardQueryConfigHandler;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.NIOFSDirectory;
import org.apache.lucene.util.BytesRef;
import org.apache.lucene.util.NumericUtils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

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

    public ExecutorService executorService = Executors.newFixedThreadPool(10);

    protected IndexerFactory getIndexerFactory() {
        return this.indexerFactory;
    }

    protected String getPath() {
        String path = options.get("applica.framework.indexing.lucene.data.path");
        if (StringUtils.isEmpty(path)) {
            throw new RuntimeException("Please set applica.framework.indexing.lucene.data.path");
        }

        return path;
    }

    @PostConstruct
    public void init() throws IOException, URISyntaxException {
        String path = getPath();

        analyzer = new StandardAnalyzer();
        directory =  new NIOFSDirectory(Paths.get(new URI(path)));
        indexWriter = new IndexWriter(directory, new IndexWriterConfig(analyzer));
        searcherManager = new SearcherManager(indexWriter, true, true, null);
    }

    @Override
    public <T extends Entity> void index(T entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");

        executorService.execute(() -> {
            Indexer<T> indexer = getIndexerFactory().create((Class<T>) entity.getClass()).orElse(null);
            if (indexer == null) {
                throw new RuntimeException("Indexer not found for class: " + entity.getClass().getName());
            }

            IndexedObject indexedObject = indexer.index(entity);
            IndexedMetadata<T> metadata = indexer.metadata((Class<T>) entity.getClass());

            if (indexedObject != null) {
                try {
                    Document document = createDocument(metadata, indexedObject);

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

    @Override
    public void reindexAll(Class<? extends Entity> entityType, Query dataQuery) {
        Objects.requireNonNull(entityType, "entityType cannot be null");
        List<? extends Entity> rows = Repo.of(entityType).find(dataQuery).getRows();

        for (Entity entity : rows) {
            index(entity);
        }
    }

    private boolean documentExists(String uniqueId) throws IOException {
        IndexSearcher searcher = searcherManager.acquire();
        TopDocs search = searcher.search(new TermQuery(new Term(KEY_FIELD, uniqueId)), 1);
        searcherManager.release(searcher);

        return search.totalHits > 0;
    }

    private Document createDocument(IndexedMetadata metadata, IndexedObject indexedObject) {
        Document document = new Document();

        document.add(new TextField(KEY_FIELD, indexedObject.getUniqueId(), Field.Store.YES));

        for (Property property : indexedObject.getProperties()) {
            if (property.getValue() != null) {
                IndexedFieldMetadata fieldMetadata = metadata.get(property.getKey());
                
                if (Double.class.equals(fieldMetadata.getFieldType())) {
                    document.add(new DoublePoint(property.getKey(), (Double) property.getValue()));
                    document.add(new StoredField(property.getKey(), (Double) property.getValue()));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) (double) property.getValue()));
                    }
                } else if (Float.class.equals(fieldMetadata.getFieldType())) {
                    document.add(new FloatPoint(property.getKey(), (Float) property.getValue()));
                    document.add(new StoredField(property.getKey(), (Float) property.getValue()));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) (float) property.getValue()));
                    }
                } else if (Long.class.equals(fieldMetadata.getFieldType())) {
                    document.add(new LongPoint(property.getKey(), (Long) property.getValue()));
                    document.add(new StoredField(property.getKey(), (Long) property.getValue()));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) property.getValue()));
                    }
                } else if (Integer.class.equals(fieldMetadata.getFieldType())) {
                    document.add(new IntPoint(property.getKey(), (Integer) property.getValue()));
                    document.add(new StoredField(property.getKey(), (Integer) property.getValue()));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) (int) property.getValue()));
                    }
                } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
                    document.add(new IntPoint(property.getKey(), ((Boolean) property.getValue()) ? 1 : 0));
                    document.add(new StoredField(property.getKey(), ((Boolean) property.getValue()) ? 1 : 0));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) (int) property.getValue()));
                    }
                } else if (Date.class.equals(fieldMetadata.getFieldType())) {
                    long date = Long.parseLong(DateTools.dateToString((Date) property.getValue(), DateTools.Resolution.DAY));

                    document.add(new LongPoint(property.getKey(), date));
                    document.add(new StoredField(property.getKey(), date));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), (long) property.getValue()));
                    }
                } else {
                    document.add(new TextField(property.getKey(), String.valueOf(property.getValue()), Field.Store.YES));
                }

                //document.add(new SortedDocValuesField("title", NumericUtils.));
            }
        }

        return document;
    }

    @Override
    public <T extends Entity> IndexedResult search(Class<T> entityType, Query query) {
        List<IndexedObject> result = new ArrayList<>();
        int totalResults = 0;

        try {
            Indexer<T> indexer = getIndexerFactory().create(entityType).orElse(null);
            if (indexer == null) {
                throw new RuntimeException("Indexer not found for class: " + entityType.getName());
            }

            IndexedMetadata<T> metadata = indexer.metadata(entityType);

            IndexSearcher searcher = searcherManager.acquire();

            org.apache.lucene.search.Query luceneQuery = buildLuceneQuery(metadata, query);
            Sort luceneSort = buildLuceneSort(metadata, query);
            TopDocsCollector collector;

            if (luceneSort.getSort().length == 0) {
                collector = TopScoreDocCollector.create(1000);
            } else {
                collector = TopFieldCollector.create(luceneSort, 1000, null, true, true, true, true);
            }

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
                result.add(createDynamicObject(metadata, document));
            }

            searcherManager.release(searcher);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (QueryNodeException e) {
            e.printStackTrace();
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }

        return new IndexedResult(result, totalResults);
    }

    private <T extends Entity> Sort buildLuceneSort(IndexedMetadata<T> metadata, Query query) {
        Sort sort = new Sort();

        List<SortField> sortFields = new ArrayList<>();
        for (applica.framework.Sort frameworkSort : query.getSorts()) {
            IndexedFieldMetadata fieldMetadata = metadata.get(frameworkSort.getProperty());
            sortFields.add(createSortField(fieldMetadata, frameworkSort));
        }

        if (sortFields.size() > 0) {
            SortField[] arr = new SortField[sortFields.size()];
            sortFields.toArray(arr);
            sort.setSort(arr);
        }

        return sort;
    }

    private SortField createSortField(IndexedFieldMetadata fieldMetadata, applica.framework.Sort frameworkSort) {
        if (Integer.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.INT, frameworkSort.isDescending());
        } else if (Double.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.DOUBLE, frameworkSort.isDescending());
        } else if (Float.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.FLOAT, frameworkSort.isDescending());
        } else if (Long.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.LONG, frameworkSort.isDescending());
        } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.INT, frameworkSort.isDescending());
        } else if (Date.class.equals(fieldMetadata.getFieldType())) {
            return new SortedNumericSortField(frameworkSort.getProperty(), SortField.Type.LONG, frameworkSort.isDescending());
        } else {
            return new SortField(frameworkSort.getProperty(), SortField.Type.STRING, frameworkSort.isDescending());
        }
    }

    private <T extends Entity> IndexedObject createDynamicObject(IndexedMetadata<T> metadata, Document document) throws java.text.ParseException {
        IndexedObject dynamicObject = new IndexedObject();

        for (IndexableField indexableField : document.getFields()) {
            IndexedFieldMetadata fieldMetadata = metadata.get(indexableField.name());

            if (Integer.class.equals(fieldMetadata.getFieldType())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().intValue());
            } else if (Double.class.equals(fieldMetadata.getFieldType())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().doubleValue());
            } else if (Float.class.equals(fieldMetadata.getFieldType())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().floatValue());
            } else if (Long.class.equals(fieldMetadata.getFieldType())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().longValue());
            } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
                dynamicObject.setProperty(indexableField.name(), indexableField.numericValue().intValue() > 0);
            } else if (Date.class.equals(fieldMetadata.getFieldType())) {
                //dynamicObject.setProperty(indexableField.name(), new Date(indexableField.numericValue().longValue()));
                dynamicObject.setProperty(indexableField.name(), DateTools.stringToDate(indexableField.stringValue()));
            } else {
                dynamicObject.setProperty(indexableField.name(), indexableField.stringValue());
            }

            if (indexableField.name().equals(KEY_FIELD)) {
                dynamicObject.setUniqueId(indexableField.stringValue());
            }
        }

        return dynamicObject;
    }

    private <T extends Entity> org.apache.lucene.search.Query buildLuceneQuery(IndexedMetadata<T> metadata, Query query) throws ParseException, QueryNodeException {
        StringBuilder queryString = new StringBuilder();

        StandardQueryParser parser = new StandardQueryParser();
        parser.setDateResolution(DateTools.Resolution.DAY);
        Map<String, PointsConfig> pointsConfig = new HashMap<>();

        for (IndexedFieldMetadata fieldMetadata : metadata.getFields()) {
            if (Integer.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Integer.class));
            } else if (Double.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Double.class));
            } else if (Float.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Float.class));
            } else if (Long.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Long.class));
            } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Integer.class));
            } else if (Date.class.equals(fieldMetadata.getFieldType())) {
                pointsConfig.put(fieldMetadata.getFieldName(), new PointsConfig(NumberFormat.getNumberInstance(Locale.ROOT), Long.class));
            }
        }
        parser.setPointsConfigMap(pointsConfig);
        parser.setAllowLeadingWildcard(true);

        if (StringUtils.isNotEmpty(query.getKeyword())) {
            queryString.append(query.getKeyword());
        } else {
            query.getFilters().forEach(f -> queryString.append(f.getProperty()).append(":").append(f.getValue()).append(" "));
        }

        String querys = queryString.toString().trim();
        if (StringUtils.isEmpty(querys)) {
            querys = "*:*";
        }

        org.apache.lucene.search.Query luceneQuery = parser.parse(querys, KEY_FIELD);
        return luceneQuery;
    }

    public void await() {
        executorService.shutdown();
        try {
            executorService.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}

