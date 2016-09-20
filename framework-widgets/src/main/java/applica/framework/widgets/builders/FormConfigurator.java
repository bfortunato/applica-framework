package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.library.utils.TypeUtils;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.fields.Params;
import applica.framework.widgets.mapping.PropertyMapper;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.render.FormFieldRenderer;
import applica.framework.widgets.render.FormRenderer;

import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.HashMap;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/14/13
 * Time: 4:45 PM
 */
public class FormConfigurator {
    protected Class<? extends Entity> entityType;
    protected String identifier;
    protected String currentFieldSet = null;
    protected HashMap<String, String> storedParams = new HashMap<>();

    public FormConfigurator() {

    }

    public static FormConfigurator configure(Class<? extends Entity> entityType, String identifier) {
        return configure(entityType, identifier, null, null);
    }

    public static FormConfigurator configure(Class<? extends Entity> entityType, String identifier, String title, String action) {
        FormConfigurator formConfigurator = new FormConfigurator();
        formConfigurator.entityType = entityType;
        formConfigurator.identifier = identifier;

        CrudConfiguration.instance().registerForm(entityType, identifier, title, action);

        return formConfigurator;
    }

    public FormConfigurator renderer(Class<? extends FormRenderer> renderer) {
        CrudConfiguration.instance().registerFormRenderer(entityType, renderer);
        return this;
    }

    public FormConfigurator processor(Class<? extends FormProcessor> formProcessor) {
        CrudConfiguration.instance().registerFormProcessor(entityType, formProcessor);
        return this;
    }

    public FormConfigurator visibility(Class<? extends Visibility> visibility) {
        CrudConfiguration.instance().registerVisibility(entityType, visibility);
        return this;
    }

    public FormConfigurator repository(Class<? extends Repository> repository) {
        CrudConfiguration.instance().registerFormRepository(entityType, repository);
        return this;
    }

    public FormConfigurator method(String method) {
        CrudConfiguration.instance().registerFormMethod(entityType, method);
        return this;
    }

    public FormConfigurator button(String label, String type, String action) {
        CrudConfiguration.instance().registerFormButton(entityType, label, type, action);
        return this;
    }

    public FormConfigurator fieldSet(String fieldSet) {
        this.currentFieldSet = fieldSet;
        return this;
    }

    public FormConfigurator noFieldSet() {
        this.currentFieldSet = null;
        return this;
    }

    /**
     * Use this to register parameter for all fields configured after this function call
     * @param key
     * @param value
     * @return
     */
    public FormConfigurator registerParam(String key, String value) {
        this.storedParams.put(key, value);
        return this;
    }

    public FormConfigurator unregisterParam(String key) {
        this.storedParams.remove(key);
        return this;
    }

    public FormConfigurator tab(String tabName) {
        this.registerParam(Params.TAB, tabName);
        return this;
    }

    public FormConfigurator noTab() {
        this.unregisterParam(Params.TAB);
        return this;
    }

    private void registerStoredParams(String property) {
        this.storedParams.forEach((k, v) -> CrudConfiguration.instance().setPropertyParam(entityType, property, k, v));
    }

    public FormConfigurator field(String property, String description) {
        CrudConfiguration.instance().registerFormField(entityType, property, getDataType(property), description, currentFieldSet);
        registerStoredParams(property);
        return this;
    }

    public FormConfigurator field(String property, String description, Class<? extends FormFieldRenderer> renderer) {
        CrudConfiguration.instance().registerFormField(entityType, property, getDataType(property), description, currentFieldSet);
        if (renderer != null) {
            CrudConfiguration.instance().registerFormFieldRenderer(entityType, property, renderer);
        }
        registerStoredParams(property);
        return this;
    }

    public FormConfigurator field(String property, String description, Class<? extends FormFieldRenderer> renderer, Class<? extends PropertyMapper> propertyMapper) {
        CrudConfiguration.instance().registerFormField(entityType, property, getDataType(property), description, currentFieldSet);
        if (renderer != null) {
            CrudConfiguration.instance().registerFormFieldRenderer(entityType, property, renderer);
        }
        if (propertyMapper != null) {
            CrudConfiguration.instance().registerPropertyMapper(entityType, property, propertyMapper);
        }
        registerStoredParams(property);
        return this;
    }

    public FormConfigurator propertyMapper(String property, Class<? extends PropertyMapper> propertyMapper) {
        CrudConfiguration.instance().registerPropertyMapper(entityType, property, propertyMapper);
        registerStoredParams(property);
        return this;
    }

    public FormConfigurator param(String property, String key, String value) {
        CrudConfiguration.instance().setPropertyParam(entityType, property, key, value);
        return this;
    }

    public FormConfigurator param(String key, String value) {
        CrudConfiguration.instance().setParam(entityType, key, value);
        return this;
    }

    //

    private Type getDataType(String property) {
        if(entityType != null) {
            try {
                Field field = TypeUtils.getField(entityType, property);
                return field.getGenericType();
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e); //programmers error
            }
        }

        return null;
    }
}
