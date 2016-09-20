package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.library.utils.TypeUtils;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.render.CellRenderer;
import applica.framework.widgets.render.GridRenderer;

import java.lang.reflect.Field;
import java.lang.reflect.Type;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/14/13
 * Time: 4:45 PM
 */
public class GridConfigurator {
    private Class<? extends Entity> entityType;
    private String identifier;

    private GridConfigurator() {

    }

    public static GridConfigurator configure(Class<? extends Entity> entityType, String identifier) {
        return configure(entityType, identifier, null);
    }

    public static GridConfigurator configure(Class<? extends Entity> entityType, String identifier, String title) {
        GridConfigurator gridConfigurator = new GridConfigurator();
        gridConfigurator.entityType = entityType;
        gridConfigurator.identifier = identifier;

        CrudConfiguration.instance().registerGrid(entityType, identifier, title);

        return gridConfigurator;
    }

    public GridConfigurator renderer(Class<? extends GridRenderer> renderer) {
        CrudConfiguration.instance().registerGridRenderer(entityType, renderer);
        return this;
    }

    public GridConfigurator repository(Class<? extends Repository> repository) {
        CrudConfiguration.instance().registerGridRepository(entityType, repository);
        return this;
    }

    public GridConfigurator visibility(Class<? extends Visibility> visibility) {
        CrudConfiguration.instance().registerVisibility(entityType, visibility);
        return this;
    }

    public GridConfigurator formIdentifier(String formIdentifier) {
        CrudConfiguration.instance().registerGridFormIdentifier(identifier, formIdentifier);
        return this;
    }

    public GridConfigurator searchForm(Class<? extends Entity> formType) {
        CrudConfiguration.instance().registerSearchable(entityType, formType);
        return this;
    }

    public GridConfigurator sortBy(String property, boolean descending) {
        CrudConfiguration.instance().registerSortBy(entityType, property, descending);
        return this;
    }

    public GridConfigurator column(String property, String header, boolean linked) {
        CrudConfiguration.instance().registerGridColumn(entityType, property, header, getDataType(property), linked);
        return this;
    }

    public GridConfigurator column(String property, String header, boolean linked, Class<? extends CellRenderer> cellRenderer) {
        CrudConfiguration.instance().registerGridColumn(entityType, property, header, getDataType(property), linked);
        CrudConfiguration.instance().registerCellRenderer(entityType, property, cellRenderer);
        return this;
    }

    public GridConfigurator param(String property, String key, String value) {
        CrudConfiguration.instance().setPropertyParam(entityType, property, key, value);
        return this;
    }

    public GridConfigurator param(String key, String value) {
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
