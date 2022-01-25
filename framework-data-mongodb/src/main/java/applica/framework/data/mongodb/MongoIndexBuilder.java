package applica.framework.data.mongodb;

import applica.framework.Entity;
import applica.framework.data.Index;
import applica.framework.data.IndexBuilder;
import applica.framework.data.IndexType;
import applica.framework.library.utils.Strings;
import applica.framework.library.utils.TypeUtils;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class MongoIndexBuilder implements IndexBuilder {

    private record IndexData(String collection, String path, IndexType type, String datasource) {}

    private Log logger = LogFactory.getLog(getClass());
    private final MongoHelper mongoHelper;

    public MongoIndexBuilder(MongoHelper mongoHelper) {
        this.mongoHelper = mongoHelper;
    }

    @Override
    public void buildIndexes(List<Class<? extends Entity>> entityTypes)  {
        var indexes = new ArrayList<IndexData>();

        for (var entityType : entityTypes) {
            var fields = TypeUtils.getAllFields(entityType);
            var collection = Strings.pluralize(StringUtils.uncapitalize(entityType.getSimpleName()));
            ;
            for (var field : fields) {
                var indexAnnotation = field.getAnnotation(Index.class);
                if (indexAnnotation != null) {
                    var path = StringUtils.isNotEmpty(indexAnnotation.path()) ? indexAnnotation.path() : field.getName();
                    var type = indexAnnotation.type();
                    var datasource = indexAnnotation.datasource();

                    indexes.add(new IndexData(collection, path, type, datasource));
                }
            }
        }

        for (var index : indexes) {
            var db = mongoHelper.getDatabase(index.datasource());
            var collection = db.getCollection(index.collection());
            switch (index.type()) {
                case UNIQUE -> collection.createIndex(Indexes.ascending(index.path()), new IndexOptions().unique(true));
                case UNIQUE_DESCENDING -> collection.createIndex(Indexes.descending(index.path()), new IndexOptions().unique(true));
                case ASCENDING -> collection.createIndex(Indexes.ascending(index.path()));
                case DESCENDING -> collection.createIndex(Indexes.descending(index.path()));
            }

            logger.info("Database index created: " + index.toString());
        }
    }
}
