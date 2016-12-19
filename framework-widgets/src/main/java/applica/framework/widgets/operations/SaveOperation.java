package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.ValidationException;
import applica.framework.ValidationResult;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.processors.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;

import java.util.Map;

public class SaveOperation {
    private Repository repository;
    private FormProcessor formProcessor;
    private Class<? extends Entity> entityType;

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

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> type) {
        this.entityType = type;
    }

    public void save(Map<String, String[]> requestValues) throws FormProcessException, ValidationException {
        if (formProcessor == null) throw new ProgramException("Processor is null");
        if (entityType == null) throw new ProgramException("Entity entityType is null");
        if (repository == null) throw new ProgramException("Missing repository");

        ValidationResult validationResult = new ValidationResult();

        Entity entity = formProcessor.toEntity(entityType, requestValues, validationResult);
        if (!validationResult.isValid())
            throw new ValidationException(validationResult);

        if (entity == null) {
            throw new FormProcessException();
        }

        repository.save(entity);
    }
}
