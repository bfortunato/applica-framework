package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;

import java.util.Map;

public class SaveOperation {
    private Repository repository;
    private FormProcessor formProcessor;
    private Class<? extends Entity> type;

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public FormProcessor getFormProcessor() {
        return formProcessor;
    }

    public void setFormProcessor(FormProcessor formProcessor) {
        this.formProcessor = formProcessor;
    }

    public Class<? extends Entity> getType() {
        return type;
    }

    public void setType(Class<? extends Entity> type) {
        this.type = type;
    }

    public void save(Form form, Map<String, String[]> requestValues) throws CrudConfigurationException, FormProcessException, ValidationException {
        if (formProcessor == null) throw new CrudConfigurationException("Processor is null");
        if (type == null) throw new CrudConfigurationException("Entity type is null");
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        ValidationResult validationResult = new ValidationResult();

        Entity entity = formProcessor.toEntity(form, type, requestValues, validationResult);
        if (!validationResult.isValid())
            throw new ValidationException(validationResult);

        if (entity == null) {
            throw new FormProcessException();
        }

        repository.save(entity);
    }
}
