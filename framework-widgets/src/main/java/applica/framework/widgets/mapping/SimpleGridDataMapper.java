package applica.framework.widgets.mapping;

import applica.framework.widgets.GridColumn;
import applica.framework.widgets.GridDescriptor;
import applica.framework.Entity;
import org.apache.commons.beanutils.PropertyUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SimpleGridDataMapper implements GridDataMapper {

    @Override
    public void mapGridDataFromEntities(GridDescriptor gridDescriptor, List<Map<String, Object>> gridData, List<? extends Entity> entities) {
        for (Entity entity : entities) {
            Map<String, Object> row = new HashMap<String, Object>();
            row.put("id", entity.getId());
            for (GridColumn column : gridDescriptor.getColumns()) {
                Object value = null;
                try {
                    value = PropertyUtils.getSimpleProperty(entity, column.getProperty());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                row.put(column.getProperty(), value);
            }
            gridData.add(row);
        }
    }

}
