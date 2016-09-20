package applica.framework.widgets.actions;

import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.FormCreationException;
import applica.framework.widgets.FormProcessException;
import applica.framework.ValidationException;
import applica.framework.Entity;
import applica.framework.library.responses.FormActionResponse;
import applica.framework.widgets.utils.CrudUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: bimbobruno
 * Date: 26/10/13
 * Time: 17:14
 * To change this template use File | Settings | File Templates.
 */
public abstract class EntityFormAction implements FormAction {

    @Override
    public FormActionResponse perform(String identifier, HttpServletRequest request, HttpServletResponse response) {
        FormActionResponse result = new FormActionResponse();
        try {
            Entity entity = CrudUtils.toEntityWithValidation(identifier, request.getParameterMap());
            performEntity(result, entity, identifier, request, response);
        } catch (FormCreationException e) {
            result.setError(true);
            result.setMessage("Error creating form");
        } catch (CrudConfigurationException e) {
            result.setError(true);
            result.setMessage("Crud configuration error");
        } catch (FormProcessException e) {
            result.setError(true);
            result.setMessage("Error processing form");
        } catch (ValidationException e) {
            result.setValidationResult(e.getValidationResult());
            result.setValid(false);
            result.setMessage("Validation error");
        }

        return result;
    }

    public abstract void performEntity(FormActionResponse result, Entity entity, String identifier, HttpServletRequest request, HttpServletResponse response);

}
