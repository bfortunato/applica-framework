package applica.framework.indexing.test;

import applica.framework.Filter;
import applica.framework.Query;
import applica.framework.Sort;
import applica.framework.indexing.core.IndexedResult;
import applica.framework.indexing.services.IndexerFactory;
import applica.framework.indexing.services.LuceneIndexService;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

public class LuceneTest {

    @Test
    public void testIndexAndSearch() throws IOException, URISyntaxException, InterruptedException {
        IndexerFactory indexerFactory = new TestIndexerFactory();

        LuceneIndexService indexService = new LuceneIndexService() {
            @Override
            protected String getPath() {
                return String.format("file:///%s/lucene_test", System.getProperty("java.io.tmpdir"));
            }

            @Override
            protected IndexerFactory getIndexerFactory() {
                return indexerFactory;
            }
        };

        indexService.init();

        for (int i = 0; i < 30; i++) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DATE, i);
            indexService.index(new TestEntity(i, i, String.valueOf(i), i, i, calendar.getTime()));
        }
        indexService.await();

        Query query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(2);
        query.setRowsPerPage(5);
        query.setKeyword("intValue:[10 TO 39]");



        IndexedResult search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(30, search.getTotalRows());
        Assert.assertEquals(5, search.getRows().size());



        for (int i = 0; i < 5; i++) {
            int v = (int) search.getRows().get(i).getProperty("intValue");
            Assert.assertEquals(i + 15, v);
        }

        /*

        DateFormat dateFormat = new SimpleDateFormat("YYYYMMdd");
        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, 1);
        Date tomorrow = calendar.getTime();
        query.getFilters().add(new Filter("dateValue", Arrays.asList(Long.parseLong(dateFormat.format(new Date())), Long.parseLong(dateFormat.format(tomorrow))), Filter.RANGE));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());


        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        query.getFilters().add(new Filter("longValue", Arrays.asList(0, 1), Filter.RANGE));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());

        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        query.getFilters().add(new Filter("longValue", 49, Filter.GT));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(1, search.getTotalRows());


        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        query.getFilters().add(new Filter("longValue", 49, Filter.GTE));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());

        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        query.getFilters().add(new Filter("doubleValue", 1, Filter.LT));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(1, search.getTotalRows());


        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        query.getFilters().add(new Filter("floatValue", 1, Filter.LTE));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());


        query = new Query();
        query.getSorts().add(new Sort("intValue", false));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(50, search.getTotalRows());


        */

        query = Query.build()
                .keyword("(floatValue:1 AND longValue:1) OR floatValue:3");

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());





        query = Query.build()
                .conjunction()
                    .disjunction()
                        .eq("floatValue", 1)
                        .eq("floatValue", 2)
                        .conjunction()
                            .eq("doubleValue", 3)
                            .eq("intValue", 3)
                            .finishIntermediateFilter()
                        .finishIntermediateFilter()
                    .finish();

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(3, search.getTotalRows());

        query = Query.build()
                .like("stringValue", "1*");
                //.keyword("stringValue:1*");

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(11, search.getTotalRows());
    }

}
