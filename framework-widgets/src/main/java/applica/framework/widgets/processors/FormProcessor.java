package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.ValidationResult;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;

/**
 * A processor is a object that process form data and do all extra operation to return a "ready to save" entity
 */
public interface FormProcessor {
    /**
     * Process entity form data to get a complete entity to save
     * @param data The form given data
     * @return Processed entity
     * @throws FormProcessException
     */
    Entity process(ObjectNode data) throws FormProcessException;

    /**
     * Back operation, to give a serialized entity to give to form (js side)
     * @param entity
     * @return
     * @throws FormProcessException
     */
    ObjectNode deprocess(Entity entity) throws FormProcessException;

    /**
     * Returns the type of entity that will be created in the processing phase. This is also used to select the correct processor for entity in FormProcessorFactory
     * @return
     */
    Class<? extends Entity> getEntityType();
}
