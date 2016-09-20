package applica.framework.widgets.controllers;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/26/13
 * Time: 4:30 PM
 */

import applica.framework.LoadRequest;
import applica.framework.ValidationException;
import applica.framework.library.i18n.controllers.LocalizedController;
import applica.framework.library.responses.*;
import applica.framework.widgets.*;
import applica.framework.widgets.acl.CrudAuthorizationException;
import applica.framework.widgets.acl.CrudGuard;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.builders.*;
import applica.framework.widgets.data.FormDataProvider;
import applica.framework.widgets.data.GridDataProvider;
import applica.framework.widgets.operations.DeleteOperation;
import applica.framework.widgets.operations.SaveOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.StringWriter;

@RequestMapping("/crud")
public class CrudController extends LocalizedController {

    @Autowired(required = false)
    private CrudGuard crudGuard;

    @RequestMapping(value="/grid/{entity}")
    public @ResponseBody SimpleResponse grid(@PathVariable String entity, String loadRequest) {
        if(crudGuard != null) {
            try {
                crudGuard.check(CrudPermission.LIST, entity);
            } catch (CrudAuthorizationException e) {
                return new ErrorResponse(localization.getMessage("crud.unauthorized"));
            }
        }

        GridResponse response = new GridResponse();

        StringWriter writer = new StringWriter();
        Grid grid;
        GridDataProvider dataProvider;
        try {
            grid = GridBuilder.instance().build(entity);
            dataProvider = GridDataProviderBuilder.instance().build(entity);
            dataProvider.load(grid, LoadRequest.fromJSON(loadRequest));
            grid.write(writer);
            if (StringUtils.isEmpty(grid.getTitle())) {
                grid.setTitle(localization.getMessage("crud.grid.title." + entity));
            }
            response.setTitle(grid.getTitle());
            response.setSearchFormIncluded(grid.getSearchForm() != null);
            response.setFormIdentifier(grid.getFormIdentifier());
            response.setCurrentPage(grid.getCurrentPage());
            response.setPages(grid.getPages());
            response.setError(false);
        } catch (CrudConfigurationException e) {
            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        } catch (GridCreationException e) {
            response.setError(true);
            response.setMessage("Error creating grid: " + e.getMessage());
        }

        response.setContent(writer.toString());
        return response;
    }

    @RequestMapping(value="/grid/{entity}/delete", method= RequestMethod.POST)
    public @ResponseBody SimpleResponse gridDelete(@PathVariable String entity, @RequestParam String ids) {
        if(crudGuard != null) {
            try {
                crudGuard.check(CrudPermission.DELETE, entity);
            } catch (CrudAuthorizationException e) {
                return new ErrorResponse(localization.getMessage("crud.unauthorized"));
            }
        }

        SimpleResponse response = new SimpleResponse();

        DeleteOperation deleteOperation;
        try {
            deleteOperation = DeleteOperationBuilder.instance().build(entity);
            deleteOperation.delete(ids.split(","));
            response.setError(false);
        } catch (CrudConfigurationException e) {
            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        }

        return response;
    }

    @RequestMapping(value="/form/{entity}", method=RequestMethod.GET)
    public @ResponseBody SimpleResponse form(@PathVariable String entity, String id) {
        if(crudGuard != null) {
            try {
                String crudPermission = StringUtils.hasLength(id) ? CrudPermission.EDIT : CrudPermission.NEW;
                crudGuard.check(crudPermission, entity);
            } catch (CrudAuthorizationException e) {
                 return new ErrorResponse(localization.getMessage("crud.unauthorized"));
            }
        }

        FormResponse response = new FormResponse();

        StringWriter writer = new StringWriter();
        Form form;
        FormDataProvider dataProvider;
        try {
            form = FormBuilder.instance().build(entity);
            dataProvider = FormDataProviderBuilder.instance().build(entity);
            dataProvider.load(form, id);

            form.setAction("javascript:;");
            if (StringUtils.isEmpty(form.getTitle())) {
                if (!form.isEditMode()) {
                    form.setTitle(localization.getMessage(String.format("crud.form.create.%s", entity)));
                } else {
                    form.setTitle(localization.getMessage(String.format("crud.form.edit.%s", entity)));
                }
            }

            form.write(writer);

            response.setTitle(form.getTitle());
            response.setAction("javascript:;");
            response.setError(false);
        } catch (FormProcessException e) {
            response.setError(true);
            response.setMessage("Error processing form: " + e.getMessage());
        } catch (CrudConfigurationException e) {
            response.setError(true);
            response.setMessage("Crud configuration error: " + e.getMessage());
        } catch (FormCreationException e) {
            response.setError(true);
            response.setMessage("Error creating form: " + e.getMessage());
        }

        response.setContent(writer.toString());

        return response;
    }

    @RequestMapping(value="/form/{entity}/save", method=RequestMethod.POST)
    public @ResponseBody SimpleResponse save(@PathVariable String entity, HttpServletRequest request) {
        if(crudGuard != null) {
            try {
                crudGuard.check(CrudPermission.SAVE, entity);
            } catch (CrudAuthorizationException e) {
                 return new ErrorResponse(localization.getMessage("crud.unauthorized"));
            }
        }

        FormActionResponse response = new FormActionResponse();
        SaveOperation saveOperation;
        try {
            Form form = FormBuilder.instance().build(entity);
            saveOperation = SaveOperationBuilder.instance().build(entity);
            saveOperation.save(form, request.getParameterMap());
            response.setValid(true);
        } catch(ValidationException e) {
            response.setError(false);
            response.setValid(false);
            response.setMessage("Validation error");
            response.setValidationResult(e.getValidationResult());
        } catch (FormProcessException e) {
            response.setError(true);
            response.setMessage("Error processing form");
        } catch (Exception e) {
            response.setError(true);
            response.setMessage("Error saving entity: " + e.getMessage());
            e.printStackTrace();
        }

        return response;
    }

}
