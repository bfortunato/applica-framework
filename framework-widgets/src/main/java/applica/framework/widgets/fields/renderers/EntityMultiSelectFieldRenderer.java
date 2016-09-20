package applica.framework.widgets.fields.renderers;

import applica.framework.Entity;
import applica.framework.LoadRequest;
import applica.framework.RepositoriesFactory;
import applica.framework.library.SelectableItem;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 12:17
 */
public abstract class EntityMultiSelectFieldRenderer extends MultiSelectFieldRenderer {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    public abstract Class<? extends Entity> getEntityType();

    @Override
    public List<SelectableItem> getItems(List<? extends Entity> selectedItems) {
        return (List<SelectableItem>) repositoriesFactory.createForEntity(getEntityType())
                .find(LoadRequest.build())
                .getRows()
                .stream()
                .map(e -> new SelectableItem(
                            e.toString(),
                            ((Entity) e).getId().toString(),
                            selectedItems.stream().anyMatch(ce -> ce.getId().equals(((Entity) e).getId()))
                        )
                )
                .collect(Collectors.toList());
    }

}
