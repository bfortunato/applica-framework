package applica.framework.widgets.factory;

import applica.framework.Entity;
import applica.framework.widgets.operations.*;

import java.util.HashMap;

/**
 * Created by bimbobruno on 07/02/2017.
 */
public interface OperationsFactory {

    FindOperation createFind(Class<? extends Entity> type);
    GetOperation createGet(Class<? extends Entity> type);
    SaveOperation createSave(Class<? extends Entity> type);
    DeleteOperation createDelete(Class<? extends Entity> type);
    CreateOperation createCreate(Class<? extends Entity> type);

    HashMap<Class<? extends Entity>, DefaultOperationsFactory.OperationDefinitions> getDefaultOperations();
    DefaultOperationsFactory.OperationDefinitions generateNewOperationDefinitionsInstance();
}
