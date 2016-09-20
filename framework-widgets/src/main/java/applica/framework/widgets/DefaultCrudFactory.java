package applica.framework.widgets;

import applica.framework.DefaultRepositoriesFactory;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.mapping.PropertyMapper;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.render.CellRenderer;
import applica.framework.widgets.render.FormFieldRenderer;
import applica.framework.widgets.render.FormRenderer;
import applica.framework.widgets.render.GridRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DefaultCrudFactory implements CrudFactory {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private DefaultRepositoriesFactory repositoriesFactory;

    @Override
    public FormFieldRenderer createFormFieldRenderer(
            Class<? extends FormFieldRenderer> type,
            Class<? extends Entity> entityType, String identifier,
            String property) {
        return applicationContext.getBean(type);
    }

    @Override
    public FormRenderer createFormRenderer(Class<? extends FormRenderer> type,
                                           Class<? extends Entity> entityType, String identifier) {
        return applicationContext.getBean(type);
    }

    @Override
    public FormProcessor createFormProcessor(
            Class<? extends FormProcessor> type,
            Class<? extends Entity> entityType, String identifier) {
        return applicationContext.getBean(type);
    }

    @Override
    public GridRenderer createGridRenderer(Class<? extends GridRenderer> type,
                                           Class<? extends Entity> entityType, String identifier) {
        return applicationContext.getBean(type);
    }

    @Override
    public CellRenderer createCellRenderer(Class<? extends CellRenderer> type,
                                           Class<? extends Entity> entityType, String identifier,
                                           String property) {
        return applicationContext.getBean(type);
    }

    @Override
    public Repository createRepository(Class<? extends Repository> type,
                                       Class<? extends Entity> entityType) {
        Repository repository = null;

        if (type != null) {
            repository = repositoriesFactory.create(type);
        } else {
            repository = repositoriesFactory.createForEntity(entityType);
        }

        return repository;
    }

    @Override
    public PropertyMapper createPropertyMapper(Class<? extends PropertyMapper> type,
                                               Class<? extends Entity> entityType,
                                               String identifier,
                                               String property) {
        return applicationContext.getBean(type);
    }

    @Override
    public Visibility createVisibility(Class<? extends Visibility> type) {
        return applicationContext.getBean(type);
    }
}
