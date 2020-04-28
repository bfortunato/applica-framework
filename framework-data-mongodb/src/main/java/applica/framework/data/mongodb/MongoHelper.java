package applica.framework.data.mongodb;

import applica.framework.library.options.OptionsManager;
import com.mongodb.*;
import com.mongodb.client.MongoClients;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.*;

public class MongoHelper {

	class MongoDataSource {
		MongoClient mongo;
		DB db;
	}

	private Map<String, MongoDataSource> sources = new HashMap<>();

	@Autowired
	private OptionsManager options;
	
	public DB getDB(String dataSource) {
		MongoDataSource ds = getDataSource(dataSource);
		if(ds.db == null) {
			ds.mongo = getMongo(dataSource);
			if(ds.mongo != null) {
				ds.db = ds.mongo.getDB(getDbName(dataSource));
			}
		}
		
		return ds.db;
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
			try {
                String username = options.get(String.format("applica.framework.data.mongodb.%s.username", dataSource));
                String password = options.get(String.format("applica.framework.data.mongodb.%s.password", dataSource));
                String db = getDbName(dataSource);
                String host = options.get(String.format("applica.framework.data.mongodb.%s.host", dataSource));
				Integer port = Integer.parseInt(options.get(String.format("applica.framework.data.mongodb.%s.port", dataSource)));
                if (StringUtils.isNotEmpty(username)) {
					ds.mongo = new MongoClient(
                            new ServerAddress(host, port != null ? port : 27017),
                            Arrays.asList(createMongoCredential(dataSource, username, password, db))
                    );
                } else {
					ds.mongo = new MongoClient(host);
                }
			} catch (MongoException e) {
				e.printStackTrace();
			}
		}
		return ds.mongo;
	}

	/**
	 * Istanzia la classe MongoCredential in base al meccanismo di autenticazione eventualmente settato
	 * @param datasource
	 * @param username
	 * @param password
	 * @param db
	 * @return
	 */
	private MongoCredential createMongoCredential(String datasource, String username, String password, String db) {
		MongoCredential mongoCredential;
		String authMechanism = options.get(String.format("applica.framework.data.mongodb.%s.authMechanism", datasource));

		if (StringUtils.isNotEmpty(authMechanism) && authMechanism.equals(MongoAuthenticationMechanism.SCRAM_SHA_1.getDescription())) {
			mongoCredential = MongoCredential.createScramSha1Credential(username,
					db,
					password.toCharArray());
		} else {
			//default
			mongoCredential = MongoCredential.createMongoCRCredential(username, db, password.toCharArray());
		}

		return mongoCredential;

	}

	public void close(String dataSource) {
		MongoDataSource ds = getDataSource(dataSource);
		if(ds.mongo != null) ds.mongo.close();
	}
	
}
