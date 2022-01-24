package applica.framework.data.mongodb;

import applica.framework.data.IdValidator;
import org.bson.types.ObjectId;

public class MongoIdValidator implements IdValidator {

    @Override
    public boolean isValid(Object id) {
        if (id == null) {
            return false;
        }

        return ObjectId.isValid(id.toString());
    }

    @Override
    public Object newInstance(Object source) {
        if (!isValid(source)) { throw new RuntimeException("id not valid"); }
        return new ObjectId(source.toString());
    }
}
