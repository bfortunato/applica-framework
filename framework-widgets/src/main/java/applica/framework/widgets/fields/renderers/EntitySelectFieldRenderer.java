package applica.framework.widgets.fields.renderers;

import applica.framework.Entity;
import applica.framework.LoadRequest;
import applica.framework.RepositoriesFactory;
import applica.framework.library.SimpleItem;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 12:11
 */
public abstract class EntitySelectFieldRenderer extends SelectFieldRenderer {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    public abstract Class<? extends Entity> getEntityType();

    @Override
    public List<SimpleItem> getItems() {
        return (List<SimpleItem>) repositoriesFactory.createForEntity(getEntityType())
                .find(LoadRequest.build()).getRows().stream()
                .map(e -> new SimpleItem(e.toString(), ((Entity) e).getId().toString()))
                .collect(Collectors.toList());
    }
}
