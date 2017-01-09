package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.ValidationException;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.processors.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.validator.Validator;

public class SaveOperation {
    private Repository repository;
    private FormProcessor formProcessor;
    private Validator validator;
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

    public Validator getValidator() {
        return validator;
    }

    public void setValidator(Validator validator) {
        this.validator = validator;
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> type) {
        this.entityType = type;
    }

    public void save(ObjectNode data) throws FormProcessException, ValidationException {
        if (formProcessor == null) throw new ProgramException("Processor is null");
        if (entityType == null) throw new ProgramException("Entity entityType is null");
        if (repository == null) throw new ProgramException("Missing repository");

        Entity entity = formProcessor.process(data);

        repository.save(entity);
    }
}
