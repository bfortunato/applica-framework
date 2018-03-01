package applica.framework.indexing.test;

import applica.framework.Query;
import applica.framework.Sort;
import applica.framework.indexing.core.IndexedResult;
import applica.framework.indexing.services.IndexService;
import applica.framework.indexing.services.IndexerFactory;
import applica.framework.indexing.services.LuceneIndexService;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class LuceneTest {

    @Test
    public void testIndexAndSearch() throws IOException, URISyntaxException, InterruptedException {
        IndexerFactory indexerFactory = new TestIndexerFactory();

        LuceneIndexService indexService = new LuceneIndexService() {
            @Override
            protected String getPath() {
                return "file:///indexer/test";
            }

            @Override
            protected IndexerFactory getIndexerFactory() {
                return indexerFactory;
            }
        };

        indexService.init();

        for (int i = 0; i < 50; i++) {
            indexService.index(new TestEntity(i, i, String.valueOf(i), i, i, new Date()));
        }
        indexService.await();

        Query query = new Query();
        query.getSorts().add(new Sort("intValue", false));
        query.setKeyword("intValue:[1 TO 20]");

        IndexedResult search = indexService.search(TestEntity.class, query);

        Assert.assertEquals(20, search.getTotalRows());

        for (int i = 0; i < 20; i++) {
            int v = (int) search.getRows().get(0).getProperty("intValue");
            Assert.assertTrue(v >= 0 && v <= 20);
        }
    }

}
