package applica.framework.revision.model;

import applica.framework.revision.model.settings.Settings;
import applica.framework.widgets.entities.EntityId;
import applica.framework.widgets.entities.EntityUtils;

@EntityId("revisionSettings")
public class RevisionSettings extends Settings {

    public RevisionSettings() {}

    public RevisionSettings(String type) {
        setType(type);

    }

    public static boolean isEntityEnabled(String entity) {
        return !entity.equals(EntityUtils.getEntityIdAnnotation(RevisionSettings.class));
    }


}
