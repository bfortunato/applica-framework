package applica.framework.widgets;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.mapping.PropertyMapper;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.render.CellRenderer;
import applica.framework.widgets.render.FormFieldRenderer;
import applica.framework.widgets.render.FormRenderer;
import applica.framework.widgets.render.GridRenderer;

public interface CrudFactory {
    FormFieldRenderer createFormFieldRenderer(Class<? extends FormFieldRenderer> type, Class<? extends Entity> entityType, String identifier, String property);

    FormRenderer createFormRenderer(Class<? extends FormRenderer> type, Class<? extends Entity> entityType, String identifier);

    FormProcessor createFormProcessor(Class<? extends FormProcessor> type, Class<? extends Entity> entityType, String identifier);

    GridRenderer createGridRenderer(Class<? extends GridRenderer> type, Class<? extends Entity> entityType, String identifier);

    CellRenderer createCellRenderer(Class<? extends CellRenderer> type, Class<? extends Entity> entityType, String identifier, String property);

    Repository createRepository(Class<? extends Repository> type, Class<? extends Entity> entityType);

    PropertyMapper createPropertyMapper(Class<? extends PropertyMapper> type, Class<? extends Entity> entityType, String identifier, String property);

    Visibility createVisibility(Class<? extends Visibility> type);
}
