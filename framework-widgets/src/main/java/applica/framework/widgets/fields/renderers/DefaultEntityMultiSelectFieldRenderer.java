package applica.framework.widgets.fields.renderers;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 15:40
 */
public class DefaultEntityMultiSelectFieldRenderer extends EntityMultiSelectFieldRenderer {

    private Class<? extends Entity> entityType;

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
