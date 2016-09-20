package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.widgets.*;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.render.FormRenderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;

public class FormBuilder {

    private Log logger = LogFactory.getLog(getClass());

    private FormBuilder() {};

    private static FormBuilder s_instance = null;

    public static FormBuilder instance() {
        if (s_instance == null)
            s_instance = new FormBuilder();

        return s_instance;
    }

    public Form build(String identifier) throws FormCreationException, CrudConfigurationException {
        logger.info("Creating Form " + identifier);

        try {
            Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);

            if (type == null) {
                throw new CrudConfigurationException("Form not registered for type: " + identifier);
            }

            Form form = new Form();
            form.setIdentifier(identifier);

            String method = CrudConfiguration.instance().getFormMethod(type);
            if(StringUtils.hasLength(method)) {
                form.setMethod(method);
            }

            FormRenderer renderer = CrudConfiguration.instance().getFormRenderer(type);
            if (renderer == null) throw new FormCreationException("Cannot create renderer");

            FormDescriptor descriptor = CrudConfiguration.instance().getFormDescriptor(type);
            if (descriptor == null) throw new FormCreationException("Cannot create descriptor");

            Visibility visibility = CrudConfiguration.instance().getVisibility(type);

            form.setRenderer(renderer);
            form.setDescriptor(descriptor);
            form.setTitle(CrudConfiguration.instance().getFormTitle(type));
            form.setAction(CrudConfiguration.instance().getFormAction(type));
            form.setParams(CrudConfiguration.instance().getParams(type));
            form.setVisibility(visibility);

            logger.info(String.format("%s renderer class: %s", identifier, renderer.getClass().getName()));

            for (FormField field : descriptor.getFields()) {
                field.setRenderer(CrudConfiguration.instance().getFormFieldRenderer(type, field.getProperty()));
                field.setSearchCriteria(CrudConfiguration.instance().getSearchCriteria(type, field.getProperty()));
                field.setParams(CrudConfiguration.instance().getPropertyParams(type, field.getProperty()));
            }

            return form;
        } catch (CrudConfigurationException ex) {
            logger.error("Configuration error: " + ex.getMessage());
            throw ex;
        } catch (FormCreationException ex) {
            logger.error("Error creating grid: " + ex.getMessage());
            throw ex;
        }
    }
}
