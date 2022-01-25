package applica.framework.data;

import applica.framework.EntitiesScanner;
import applica.framework.Entity;

import java.util.List;

public interface IndexBuilder {
    void buildIndexes(List<Class<? extends Entity>> entityTypes);
}
