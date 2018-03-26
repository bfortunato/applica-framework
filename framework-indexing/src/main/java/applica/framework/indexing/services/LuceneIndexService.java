package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Filter;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.indexing.core.*;
import applica.framework.library.dynaobject.Property;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.lang.StringUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.flexible.core.QueryNodeException;
import org.apache.lucene.queryparser.flexible.standard.StandardQueryParser;
import org.apache.lucene.queryparser.flexible.standard.config.PointsConfig;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.NIOFSDirectory;
import org.apache.lucene.util.BytesRef;
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

        document.add(new StringField(KEY_FIELD, indexedObject.getUniqueId(), Field.Store.YES));

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
                        document.add(new NumericDocValuesField(property.getKey(), ((Boolean) property.getValue()) ? 1 : 0));
                    }
                } else if (Date.class.equals(fieldMetadata.getFieldType())) {
                    long date = Long.parseLong(DateUtils.dateToString((Date) property.getValue()));

                    document.add(new LongPoint(property.getKey(), date));
                    document.add(new StoredField(property.getKey(), date));
                    if (fieldMetadata.isSortable()) {
                        document.add(new NumericDocValuesField(property.getKey(), date));
                    }
                } else if (fieldMetadata.isText()) {
                    if (property.getValue() != null) {
                        String normalizedStringValue = normalizeString(String.valueOf(property.getValue()));
                        document.add(new TextField(property.getKey(), normalizedStringValue, Field.Store.NO));
                        document.add(new StoredField(property.getKey(), String.valueOf(property.getValue())));
                        if (fieldMetadata.isSortable()) {
                            document.add(new SortedDocValuesField(property.getKey(), new BytesRef(normalizedStringValue)));
                        }
                    }
                } else {
                    if (property.getValue() != null) {
                        String normalizedStringValue = normalizeString(String.valueOf(property.getValue()));
                        document.add(new StringField(property.getKey(), normalizedStringValue, Field.Store.NO));
                        document.add(new StoredField(property.getKey(), String.valueOf(property.getValue())));
                        if (fieldMetadata.isSortable()) {
                            document.add(new SortedDocValuesField(property.getKey(), new BytesRef(normalizedStringValue)));
                        }
                    }
                }

                //document.add(new SortedDocValuesField("title", NumericUtils.));
            }
        }

        return document;
    }

    private String normalizeString(String value) {
        if (value != null) {
            return value.trim().toLowerCase();
        }

        return null;
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
                dynamicObject.setProperty(indexableField.name(), DateUtils.stringToDate(indexableField.stringValue()));
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
        query = normalizedQuery(query);

        StandardQueryParser parser = new StandardQueryParser();
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

        org.apache.lucene.search.Query luceneQuery = null;

        BooleanQuery.Builder rootBuilder = new BooleanQuery.Builder();
        if (!StringUtils.isEmpty(query.getKeyword())) {
            luceneQuery = parser.parse(query.getKeyword(), KEY_FIELD);
        } else {
            for (Filter filter : query.getFilters()) {
                addFilterToParent(rootBuilder, filter, Filter.AND, metadata, parser);
            }

            if (query.getFilters().size() == 1 && Filter.NE.equals(query.getFilters().get(0).getType())) {
                rootBuilder.add(parser.parse("*:*", KEY_FIELD), BooleanClause.Occur.SHOULD);
            }

            BooleanQuery finalQuery = rootBuilder.build();
            if (finalQuery.clauses().size() > 0) {
                luceneQuery = finalQuery;
            }
        }

        if (luceneQuery == null) {
            luceneQuery = parser.parse("*:*", KEY_FIELD);
        }

        return luceneQuery;
    }

    private Query normalizedQuery(Query query) {
        Query l = new Query();
        if (StringUtils.isNotEmpty(query.getKeyword())) {
            l.setKeyword(query.getKeyword());
        }

        l.setSorts(query.getSorts());
        l.setPage(query.getPage());
        l.setRowsPerPage(query.getRowsPerPage());
        l.setFilters(normalizedFilters(query.getFilters()));

        return l;
    }

    private List<Filter> normalizedFilters(List<Filter> filters) {
        List<Filter> lwFilters = new ArrayList<>();
        if (filters!= null) {
            for (Filter filter : filters) {
                if (filter.getValue() != null) {
                    if (Filter.OR.equals(filter.getType()) || Filter.AND.equals(filter.getType())) {
                        List<Filter> children = filter.getChildren();
                        if (children != null) {
                            lwFilters.add(new Filter(null, normalizedFilters(children), filter.getType()));
                        }
                    } else if (String.class.equals(filter.getValue().getClass())) {
                        String value = normalizeString((String) filter.getValue());
                        if (!valueIsRange(value)) {
                            lwFilters.add(new Filter(filter.getProperty(), value, filter.getType()));
                        }
                    } else {
                        lwFilters.add(new Filter(filter.getProperty(), filter.getValue(), filter.getType()));
                    }
                }
            }
        }

        return lwFilters;
    }

    private boolean valueIsRange(String value) {
        return value.startsWith("[") && value.contains("TO") && value.endsWith("]");
    }


    private void addFilterToParent(BooleanQuery.Builder parent, Filter filter, String condition, IndexedMetadata metadata, StandardQueryParser parser) throws QueryNodeException {
        if (filter.getValue() == null) {
            return;
        }

        IndexedFieldMetadata fieldMetadata = metadata.get(filter.getProperty());

        if (Objects.equals(Filter.GT, filter.getType())) {
            double value = Double.parseDouble(String.valueOf(filter.getValue()));
            createRangeQuery(parent, filter, condition, fieldMetadata, value, null);
        } else if (Objects.equals(Filter.GTE, filter.getType())) {
            double value = Double.parseDouble(String.valueOf(filter.getValue()));
            createRangeQuery(parent, filter, condition, fieldMetadata, value - 1, null);
        } else if (Objects.equals(Filter.LT, filter.getType())) {
            double value = Double.parseDouble(String.valueOf(filter.getValue()));
            createRangeQuery(parent, filter, condition, fieldMetadata, null, value);
        } else if (Objects.equals(Filter.LTE, filter.getType())) {
            double value = Double.parseDouble(String.valueOf(filter.getValue()));
            createRangeQuery(parent, filter, condition, fieldMetadata, null, value + 1);
        } else if (Objects.equals(Filter.NE, filter.getType())) {
            createPointQuery(parent, filter, condition, fieldMetadata, true, parser);
        } else if (Objects.equals(Filter.RANGE, filter.getType())) {
            List values = (List) filter.getValue();
            if (values.size() != 2) {
                return;
            }

            double min = getMinValue(fieldMetadata);
            double max = getMaxValue(fieldMetadata);
            Object first = values.get(0);
            Object second = values.get(1);

            if (first != null) {
                min = Double.parseDouble(first.toString());
            }

            if (second != null) {
                max = Double.parseDouble(second.toString());
            }

            createRangeQuery(parent, filter, condition, fieldMetadata, min, max);
        } else if (Filter.AND.equals(filter.getType()) || Filter.OR.equals(filter.getType())) {
            List<Filter> filters = filter.getChildren();
            BooleanQuery.Builder newParent = new BooleanQuery.Builder();
            for (Filter childFilter : filters) {
                addFilterToParent(newParent, childFilter, filter.getType(), metadata, parser);
            }
            parent.add(newParent.build(), getOccur(condition, false));
        } else if (Filter.LIKE.equals(filter.getType())) {
            if (filter.getValue() != null) {
                String v = String.valueOf(filter.getValue());
                if (!v.contains("*")) {
                    v = String.format("*%s*", v);
                }
                filter.setValue(v);
            }
            createPointQuery(parent, filter, condition, fieldMetadata, false, parser);
        } else if (Filter.EXACT.equals(filter.getType())) {
            if (filter.getValue() != null) {
                String value = String.format("\"%s\"", String.valueOf(filter.getValue()));
                parent.add(parser.parse(value, filter.getProperty()), getOccur(condition, false));
            }
        } else {
            createPointQuery(parent, filter, condition, fieldMetadata, false, parser);
        }
    }

    private void createPointQuery(BooleanQuery.Builder parent, Filter filter, String condition, IndexedFieldMetadata fieldMetadata, boolean negate, StandardQueryParser parser) throws QueryNodeException {
        if (filter.getValue() == null) {
            return;
        }

        if (Integer.class.equals(fieldMetadata.getFieldType())) {
            parent.add(IntPoint.newExactQuery(filter.getProperty(), Integer.parseInt(String.valueOf(filter.getValue()))), getOccur(condition, negate));
        } else if (Double.class.equals(fieldMetadata.getFieldType())) {
            parent.add(DoublePoint.newExactQuery(filter.getProperty(), Double.parseDouble(String.valueOf(filter.getValue()))), getOccur(condition, negate));
        } else if (Float.class.equals(fieldMetadata.getFieldType())) {
            parent.add(FloatPoint.newExactQuery(filter.getProperty(), Float.parseFloat(String.valueOf(filter.getValue()))), getOccur(condition, negate));
        } else if (Long.class.equals(fieldMetadata.getFieldType())) {
            parent.add(LongPoint.newExactQuery(filter.getProperty(), Long.parseLong(String.valueOf(filter.getValue()))), getOccur(condition, negate));
        } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
            parent.add(IntPoint.newExactQuery(filter.getProperty(), Boolean.parseBoolean(String.valueOf(filter.getValue())) ? 1 : 0), getOccur(condition, negate));
        } else if (Date.class.equals(fieldMetadata.getFieldType())) {
            parent.add(LongPoint.newExactQuery(filter.getProperty(), Long.parseLong(String.valueOf(filter.getValue()))), getOccur(condition, negate));
        } else {
            parent.add(parser.parse(String.valueOf(filter.getValue()), filter.getProperty()), getOccur(condition, negate));
        }
    }

    private void createRangeQuery(BooleanQuery.Builder parent, Filter filter, String condition, IndexedFieldMetadata fieldMetadata, Double minValue, Double maxValue) {
        double min = minValue == null ? getMinValue(fieldMetadata) : minValue;
        double max = maxValue == null ? getMaxValue(fieldMetadata) : maxValue;

        if (Integer.class.equals(fieldMetadata.getFieldType())) {
            parent.add(IntPoint.newRangeQuery(filter.getProperty(), (int) min, (int) max), getOccur(condition, false));
        } else if (Double.class.equals(fieldMetadata.getFieldType())) {
            parent.add(DoublePoint.newRangeQuery(filter.getProperty(), min, max), getOccur(condition, false));
        } else if (Float.class.equals(fieldMetadata.getFieldType())) {
            parent.add(FloatPoint.newRangeQuery(filter.getProperty(), (float) min, (float) max), getOccur(condition, false));
        } else if (Long.class.equals(fieldMetadata.getFieldType())) {
            parent.add(LongPoint.newRangeQuery(filter.getProperty(), (long) min, (long) max), getOccur(condition, false));
        } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
            parent.add(IntPoint.newRangeQuery(filter.getProperty(), (int) min, (int) max), getOccur(condition, false));
        } else if (Date.class.equals(fieldMetadata.getFieldType())) {
            parent.add(LongPoint.newRangeQuery(filter.getProperty(), (long) min, (long) max), getOccur(condition, false));
        }
    }

    private double getMinValue(IndexedFieldMetadata fieldMetadata) {
        if (Integer.class.equals(fieldMetadata.getFieldType())) {
            return Integer.MIN_VALUE;
        } else if (Double.class.equals(fieldMetadata.getFieldType())) {
            return Double.MIN_VALUE;
        } else if (Float.class.equals(fieldMetadata.getFieldType())) {
            return Float.MIN_VALUE;
        } else if (Long.class.equals(fieldMetadata.getFieldType())) {
            return Long.MIN_VALUE;
        } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
            return 0;
        } else if (Date.class.equals(fieldMetadata.getFieldType())) {
            return Long.MIN_VALUE;
        }
        
        return 0;
    }

    private double getMaxValue(IndexedFieldMetadata fieldMetadata) {
        if (Integer.class.equals(fieldMetadata.getFieldType())) {
            return Integer.MAX_VALUE;
        } else if (Double.class.equals(fieldMetadata.getFieldType())) {
            return Double.MAX_VALUE;
        } else if (Float.class.equals(fieldMetadata.getFieldType())) {
            return Float.MAX_VALUE;
        } else if (Long.class.equals(fieldMetadata.getFieldType())) {
            return Long.MAX_VALUE;
        } else if (Boolean.class.equals(fieldMetadata.getFieldType())) {
            return 0;
        } else if (Date.class.equals(fieldMetadata.getFieldType())) {
            return Long.MAX_VALUE;
        }

        return 0;
    }

    private BooleanClause.Occur getOccur(String condition, boolean negate) {
        if (negate) {
            return BooleanClause.Occur.MUST_NOT;
        }

        if (Filter.OR.equals(condition)) {
            return BooleanClause.Occur.SHOULD;
        }

        return BooleanClause.Occur.MUST;
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

