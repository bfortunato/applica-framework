package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.ValidationException;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.processors.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.validator.Validator;

public class GetOperation {
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

    public ObjectNode get(Object id) throws FormProcessException, ValidationException {
        if (formProcessor == null) throw new ProgramException("Processor is null");
        if (entityType == null) throw new ProgramException("Entity entityType is null");
        if (repository == null) throw new ProgramException("Missing repository");

        Entity entity = (Entity) repository.get(id).orElse(null);
        ObjectNode node = null;
        if (entity != null) {
            node = formProcessor.deprocess(entity);
        }

        return node;
    }
}
