package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.ValidationResult;
import applica.framework.library.utils.ProgramException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 07/11/13
 * Time: 09:49
 */
public class LoadFirstFormProcessor extends SimpleFormProcessor {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    @Override
    protected Entity instantiateEntity(Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException {
        Entity entity = super.instantiateEntity(type, requestValues, validationResult);
        if (requestValues.containsKey("id")) {
            try {
                BeanUtils.setProperty(entity, "id", requestValues.get("id"));
            } catch (Exception e) {}
        }
        if(entity.getId() != null) {
            Entity persistentEntity = null;
            try {
                Repository repository = repositoriesFactory.createForEntity(getEntityType());
                if(repository != null) {
                    persistentEntity = (Entity) repository.get(entity.getId()).orElseGet(() -> null);
                    if(persistentEntity != null) {
                        return persistentEntity;
                    }
                }
            } catch (ProgramException e) {
                //in case of error, return standard entity
            }
        }

        return entity;
    }
}
