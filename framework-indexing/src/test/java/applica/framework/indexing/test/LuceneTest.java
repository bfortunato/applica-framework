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

        for (int i = 0; i < 50; i++) {
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

        DateFormat dateFormat = new SimpleDateFormat("YYYYMMdd");
        query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setPage(1);
        query.setRowsPerPage(5);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, 1);
        Date tomorrow = calendar.getTime();
        query.getFilters().add(new Filter("dateValue", String.format("[\"%s\" TO \"%s\"]", dateFormat.format(new Date()), dateFormat.format(tomorrow))));

        search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(2, search.getTotalRows());
    }

}
