package applica.framework.widgets.mapping;

import applica.framework.widgets.GridDescriptor;
import applica.framework.Entity;

import java.util.List;
import java.util.Map;

public interface GridDataMapper {
    void mapGridDataFromEntities(GridDescriptor gridDescriptor, List<Map<String, Object>> gridData, List<? extends Entity> entities);
}
