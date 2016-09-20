package applica.framework.widgets.data;

import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormProcessException;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.widgets.processors.FormProcessor;

import java.util.Map;

public class FormDataProvider {
    private Repository repository;
    private FormProcessor formProcessor;

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

    public void load(Form form, Object entityId) throws CrudConfigurationException, FormProcessException {
        if (formProcessor == null) throw new CrudConfigurationException("Missing form processor");
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        form.setEditMode(entityId != null);

        Entity entity = null;
        if (entityId != null) {
            entity = ((Entity) repository.get(entityId).orElse(null));
        }

        Map<String, Object> data = formProcessor.toMap(form, entity);

        form.setData(data);
    }
}
