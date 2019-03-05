package applica._APPNAME_.data.mongodb.utils;

import org.bson.types.ObjectId;

public class MongoEntityUtils {
    public static String generateId() {
        ObjectId id = new ObjectId();
        return id.toString();

    }

    public static boolean isValidId(String entityId) {
        return ObjectId.isValid(entityId);
    }
}
