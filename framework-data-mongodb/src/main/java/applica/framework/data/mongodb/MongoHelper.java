package applica.framework.data.mongodb;

import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.LangUtils;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.*;
import java.util.function.Consumer;

public class MongoHelper {

	private Log logger = LogFactory.getLog(getClass());

	class MongoDataSource {
		MongoClient mongo;
		MongoDatabase db;
	}

	private Map<String, MongoDataSource> sources = new HashMap<>();

	@Autowired
	private OptionsManager options;
	
	public MongoDatabase getDatabase(String dataSource) {
		MongoDataSource ds = getDataSource(dataSource);
		if(ds.db == null) {
			ds.mongo = getMongo(dataSource);
			if(ds.mongo != null) {
				ds.db = ds.mongo.getDatabase(getDbName(dataSource));
			}
		}
		
		return ds.db;
	}

	@Deprecated
	public MongoDatabase getDB(String dataSource) {
		return getDatabase(dataSource);
	}

	private MongoDataSource getDataSource(String dataSource) {
		if (sources.containsKey(dataSource)) {
			return sources.get(dataSource);
		} else {
			if (!getDataSources(options).contains(dataSource)) {
				throw new RuntimeException("Bad dataSource name: " + dataSource);
			}

			MongoDataSource mds = new MongoDataSource();
			sources.put(dataSource, mds);
			return mds;
		}
	}

	public static List<String> getDataSources(OptionsManager options) {
		String dataSourcesValue = options.get("applica.framework.data.mongodb.dataSources");
		String[] split = dataSourcesValue.split(",");
		List<String> dataSources = new ArrayList<>();
		for (String ds : split) {
			dataSources.add(ds.trim());
		}

		return dataSources;
	}

    private String getDbName(String dataSource) {
		String dbName = options.get(String.format("applica.framework.data.mongodb.%s.db", dataSource));
		Assert.notNull(dbName, "Please set db name for dataSource " + dataSource);
		return dbName;
	}
	
	public MongoClient getMongo(String dataSource) {
		MongoDataSource ds = getDataSource(dataSource);

		if(ds.mongo == null) {
			int retries = 5;
			while (retries-- > 0) {
				try {
					String connectionString = options.get(String.format("applica.framework.data.mongodb.%s.connectionString", dataSource));
					if (StringUtils.isEmpty(connectionString)) {
						String username = options.get(String.format("applica.framework.data.mongodb.%s.username", dataSource));

						String password = options.get(String.format("applica.framework.data.mongodb.%s.password", dataSource));
						String db = getDbName(dataSource);
						String host = options.get(String.format("applica.framework.data.mongodb.%s.host", dataSource));
						Integer port = Integer.parseInt(options.get(String.format("applica.framework.data.mongodb.%s.port", dataSource)));
						if (StringUtils.isNotEmpty(username)) {
							connectionString = String.format("mongodb://%s:%s@%s:%d/%s", username, password, host, port, db);
						} else {
							connectionString = String.format("mongodb://%s:%d/%s", host, port, db);
						}
					}

					logger.info(String.format("Connecting (try %d) to mongodb server: %s", 3 - retries, connectionString));

					ds.mongo = MongoClients.create(connectionString);
					//LangUtils.unchecked(() -> Thread.sleep(1000));
					var dbs = ds.mongo.listDatabaseNames();

					logger.info("Databases on mongo cluster: ");
					dbs.forEach((Consumer<? super String>) d -> {
						logger.info("\t - " + d);
					});

					break;
				} catch (MongoException e) {
					logger.error("Cannot connect to mongo db: " + e.getMessage());

					if (ds.mongo != null) {
						ds.mongo.close();
						ds.mongo = null;
					}
				}
			}
		}
		return ds.mongo;
	}

	public void close(String dataSource) {
		MongoDataSource ds = getDataSource(dataSource);
		if(ds.mongo != null) ds.mongo.close();
	}
	
}
