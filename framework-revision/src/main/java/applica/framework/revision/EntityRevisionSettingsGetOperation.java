package applica.framework.revision;

import applica.framework.Entity;
import applica.framework.revision.model.RevisionSettings;
import applica.framework.revision.model.settings.SettingItem;
import applica.framework.revision.services.RevisionService;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.framework.widgets.operations.BaseGetOperation;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityRevisionSettingsGetOperation extends BaseGetOperation {

    @Autowired
    private RevisionService revisionService;


    @Override
    protected void finishNode(Entity entity, ObjectNode node) {

    }

    @Override
    public ObjectNode get(Object id) {
        RevisionSettings entityRevisionSettings = revisionService.getCurrentSettings();

        EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
        ObjectNode node = null;
        try {
            node = entitySerializer.serialize(entityRevisionSettings);

            node.putPOJO("items", EntitiesRegistry.instance().getAllRevisionEnabledEntities().stream().filter(RevisionSettings::isEntityEnabled).map(e -> new SettingItem(e, entityRevisionSettings.getItems().stream().filter(i ->i.getItemType() != null && i.getItemType().equals(e)).findFirst().orElse(null))).collect(Collectors.toList()));

        } catch (SerializationException e) {
            e.printStackTrace();
        }

        return node;
    }


    @Override
    public Class<? extends Entity> getEntityType() {
        return RevisionSettings.class;
    }


}