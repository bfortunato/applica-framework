package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.ValidationResult;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormProcessException;
import org.apache.commons.beanutils.BeanUtils;

import java.util.Map;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 07/11/13
 * Time: 09:49
 */
public class LoadFirstFormProcessor extends SimpleFormProcessor {

    @Override
    protected Entity instantiateEntity(Form form, Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException {
        Entity entity = super.instantiateEntity(form, type, requestValues, validationResult);
        if (requestValues.containsKey("id")) {
            try {
                BeanUtils.setProperty(entity, "id", requestValues.get("id"));
            } catch (Exception e) {}
        }
        if(entity.getId() != null) {
            Entity persistentEntity = null;
            try {
                Repository repository = CrudConfiguration.instance().getFormRepository(type);
                if(repository != null) {
                    persistentEntity = (Entity) repository.get(entity.getId()).orElseGet(() -> null);
                    if(persistentEntity != null) {
                        return persistentEntity;
                    }
                }
            } catch (CrudConfigurationException e) {
                //in case of error, return standard entity
            }
        }

        return entity;
    }
}
