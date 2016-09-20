package applica.framework.widgets.utils;

import applica.framework.*;
import applica.framework.widgets.*;
import applica.framework.widgets.builders.FormBuilder;
import applica.framework.widgets.builders.FormProcessorBuilder;
import applica.framework.widgets.builders.GridBuilder;
import applica.framework.Entity;
import applica.framework.LoadRequest;
import applica.framework.library.i18n.Localization;
import applica.framework.library.responses.FormResponse;
import applica.framework.library.responses.GridResponse;
import applica.framework.library.responses.SimpleResponse;
import applica.framework.widgets.mapping.*;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.library.utils.Paginator;
import org.springframework.validation.FieldError;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.Validator;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class CrudUtils {

    /**
     * Creates a form for specified identifier filled by data present in entity
     * @param entity Entity that contains form data
     * @param identifier Form identifier
     * @return A FormResponse of created form
     */
    public static SimpleResponse createFormResponse(Entity entity, String identifier) {
        FormResponse response = new FormResponse();

        try {
            Form form = FormBuilder.instance().build(identifier);
            form.setEditMode(true);
            form.setData(toMap(identifier, entity));

            response.setContent(form.writeToString());
            response.setError(false);
        } catch (FormCreationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error creating form: " + e.getMessage());
        } catch (CrudConfigurationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        } catch (FormProcessException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error processing form: " + e.getMessage());
        }

        return response;
    }

    /**
     * Creates a form for specified identifier filled by data present in request.
     * Request data is used to fill the entity using CrudUtils.toEntity() method
     * @param request Http request to get data
     * @param identifier Form identifier
     * @return A FormResponse of created form
     */
    public static FormResponse createFormResponse(HttpServletRequest request, String identifier) {
        FormResponse response = new FormResponse();

        try {
            Entity entity = CrudUtils.toEntity(identifier, request.getParameterMap());
            Form form = FormBuilder.instance().build(identifier);
            form.setEditMode(true);
            form.setData(toMap(identifier, entity));

            response.setContent(form.writeToString());
            response.setError(false);
        } catch (FormCreationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error creating form: " + e.getMessage());
        } catch (CrudConfigurationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        } catch (FormProcessException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error processing form: " + e.getMessage());
        } catch (ValidationException e) {
            //not handled
        }

        return response;
    }

    /**
     * Creates a grid with data specified in entities list
     * @param entities Grid data
     * @param identifier Grid identifier
     * @return Returns GridResponse of created grid
     */
    public static GridResponse createGridResponse(List<? extends Entity> entities, String identifier) {
        return createGridResponse(entities, identifier, null, null);
    }

    /**
     * Creates a grid with data specified in entities list.
     * LoadRequest can be specified if some filters are applied in a related search form
     * @param entities Grid data
     * @param identifier Grid identifier
     * @param loadRequest Load request used to load grid data
     * @return Returns GridResponse of created grid
     */
    public static GridResponse createGridResponse(List<? extends Entity> entities, String identifier, LoadRequest loadRequest) {
        return createGridResponse(entities, identifier, null, loadRequest);
    }

    /**
     * Creates a grid with data specified in entities list
     * @param entities Grid data
     * @param identifier Grid identifier
     * @param initializer Custom code to execute after grid creation
     * @return Returns GridResponse of created grid
     */
    public static GridResponse createGridResponse(List<? extends Entity> entities, String identifier, GridInitializer initializer) {
        return createGridResponse(entities, identifier, initializer, null);
    }

    /**
     * Creates a grid with data specified in entities list
     * LoadRequest can be specified if some filters are applied in a related search form
     * @param entities Grid data
     * @param identifier Grid identifier
     * @param initializer Custom code to execute after grid creation
     * @param loadRequest Load request used to load grid data
     * @return Returns GridResponse of created grid
     */
    public static GridResponse createGridResponse(List<? extends Entity> entities, String identifier, GridInitializer initializer, LoadRequest loadRequest) {
        GridResponse response = new GridResponse();

        try {
            Grid grid = GridBuilder.instance().build(identifier);
            setGridData(grid, entities);

            if (initializer != null) {
                initializer.initialize(grid);
            }

            if (grid.getSearchForm() != null && loadRequest != null) {
                grid.setSearched(loadRequest.getFilters().size() > 0);
                grid.getSearchForm().setData(loadRequest.filtersMap());
            }
            response.setContent(grid.writeToString());
            response.setError(false);
        } catch (GridCreationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error creating grid: " + e.getMessage());
        } catch (CrudConfigurationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        }

        return response;
    }

    /**
     * Creates a paginated grid
     * @param identifier Grid identifier
     * @param paginator Contains pagination informations
     * @return Returns GridResponse of created grid
     */
    public static GridResponse createGridResponse(String identifier, Paginator paginator) {
        GridResponse response = new GridResponse();

        try {
            Grid grid = GridBuilder.instance().build(identifier);

            if (paginator != null) {
                grid.setCurrentPage(paginator.getPage());
            }

            paginator.getLoadRequest().setRowsPerPage(grid.getRowsPerPage());
            paginator.paginate();
            grid.setPages(paginator.getPages());
            grid.setCurrentPage(paginator.getPage());

            setGridData(grid, paginator.getEntities());

            response.setContent(grid.writeToString());
            response.setError(false);
        } catch (GridCreationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Error creating grid: " + e.getMessage());
        } catch (CrudConfigurationException e) {
            e.printStackTrace();

            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        }

        return response;
    }

    /**
     * Helper method to set grid data starting from an entities list
     * @param grid
     * @param entities
     */
    public static void setGridData(Grid grid, List<? extends Entity> entities) {
        List<Map<String, Object>> data = new ArrayList<>();
        GridDataMapper mapper = new SimpleGridDataMapper();
        mapper.mapGridDataFromEntities(grid.getDescriptor(), data, entities);
        grid.setData(data);
    }

    /**
     * Convert a typical request data to a capable form data
     * @param requestData
     * @return
     */
    public static Map<String, Object> requestDataToFormData(Map<String, String[]> requestData) {
        Map<String, Object> data = new HashMap<String, Object>();
        for (Entry<String, String[]> param : requestData.entrySet()) {
            Object value = param.getValue().length > 1 ? param.getValue() : param.getValue()[0];
            data.put(param.getKey(), value);
        }

        return data;
    }

    /**
     * Helper method to calidate an entity
     * @param entity Entity to validate
     * @param identifier
     * @param applicationContext
     * @throws ValidationException
     */
    @Deprecated
    public static void validateEntity(Entity entity, String identifier, WebApplicationContext applicationContext) throws ValidationException {

        Validator validator = (Validator) applicationContext.getBean("validator-" + identifier);
        Localization localization = new Localization(applicationContext);
        Map<Object, Object> map = new HashMap<>();
        MapBindingResult result = new MapBindingResult(map, entity.getClass().getName());
        ValidationResult validationResult = new ValidationResult();
        if (validator != null) {
            validator.validate(entity, result);
            if (result.hasErrors()) {
                for (ObjectError error : result.getAllErrors()) {
                    FieldError ferror = (FieldError) error;
                    if (ferror != null) {
                        String message = error.getDefaultMessage();
                        if (localization != null) {
                            message = localization.getMessage(message);
                        }
                        validationResult.rejectValue(ferror.getField(), message);
                    }
                }
            }
        }
        if (!validationResult.isValid()) {
            throw new ValidationException(validationResult);
        }
    }

    /**
     * Utility method that converts a value to a list of strings.
     * Value can be a single object or a String[] array.
     * String arrays are typical in java requests parameters
     * @param value
     * @return
     */
    public static List<String> valueToStrings(Object value) {
        List<String> ids = new ArrayList<>();
        if (value != null) {
            if (value instanceof String[]) {
                String[] values = (String[]) value;
                for (String id : values) {
                    ids.add(id);
                }
            } else {
                ids.add(value.toString());
            }
        }

        return ids;
    }

    /**
     * Convert request data to an entity of specified identifier.
     * @param identifier
     * @param data
     * @return
     * @throws FormCreationException
     * @throws CrudConfigurationException
     * @throws FormProcessException
     * @throws ValidationException
     */
    public static Entity toEntity(String identifier, Map<String, String[]> data) throws FormCreationException, CrudConfigurationException, FormProcessException, ValidationException {
        Form form = FormBuilder.instance().build(identifier);
        FormProcessor processor = FormProcessorBuilder.instance().build(identifier);
        Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);
        Entity entity = processor.toEntity(form, type, data, null);

        return entity;
    }

    /**
     * Convert request data to an entity of specified identifier with validation.
     * @param identifier
     * @param data
     * @return
     * @throws FormCreationException
     * @throws CrudConfigurationException
     * @throws FormProcessException
     * @throws ValidationException
     */
    public static Entity toEntityWithValidation(String identifier, Map<String, String[]> data) throws FormCreationException, CrudConfigurationException, FormProcessException, ValidationException {
        Form form = FormBuilder.instance().build(identifier);
        FormProcessor processor = FormProcessorBuilder.instance().build(identifier);
        Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);
        ValidationResult result = new ValidationResult();
        Entity entity = processor.toEntity(form, type, data, result);

        if(!result.isValid()) {
            throw new ValidationException(result);
        }

        return entity;
    }

    /**
     * Convert an entity to a form capable data structure
     * @param identifier
     * @param entity
     * @return
     * @throws FormCreationException
     * @throws CrudConfigurationException
     * @throws FormProcessException
     */
    public static Map<String, Object> toMap(String identifier, Entity entity) throws FormCreationException, CrudConfigurationException, FormProcessException {
        Form form = FormBuilder.instance().build(identifier);
        FormProcessor processor = FormProcessorBuilder.instance().build(identifier);
        Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);
        Map<String, Object> map = processor.toMap(form, entity);

        return map;
    }

    /**
     * Represents grid initializer. Use an implementation of this interface to inject some initialization code after
     * calling one of the grid creation method of CrudUtils class
     */
    public interface GridInitializer {
        void initialize(Grid grid);
    }
}
