package applica._APPNAME_.data.mongodb;

import applica.framework.Entity;
import applica.framework.Sort;
import applica.framework.data.mongodb.MongoRepository;
import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.Role;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/3/13
 * Time: 10:53 PM
 */
@Repository
public class RolesMongoRepository extends MongoRepository<Role> implements RolesRepository {

    @Override
    public List<Sort> getDefaultSorts() {
        return Arrays.asList(new Sort("role", false));
    }

    @Override
    public Class<Role> getEntityType() {
        return Role.class;
    }
}
