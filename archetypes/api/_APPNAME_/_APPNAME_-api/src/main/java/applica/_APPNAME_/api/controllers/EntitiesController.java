package applica._APPNAME_.api.controllers;

import applica._APPNAME_.api.responses.ResponseCode;
import applica.framework.*;
import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.framework.widgets.builders.DeleteOperationBuilder;
import applica.framework.widgets.builders.GetOperationBuilder;
import applica.framework.widgets.builders.SaveOperationBuilder;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.framework.widgets.entities.EntityDefinition;
import applica.framework.widgets.operations.DeleteOperation;
import applica.framework.widgets.operations.GetOperation;
import applica.framework.widgets.operations.SaveOperation;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.AutoPopulatingList;
import org.springframework.validation.DataBinder;
import org.springframework.web.bind.ServletRequestParameterPropertyValues;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by bimbobruno on 06/12/2016.
 */
@RestController
@RequestMapping("/entities/{entity}")
public class EntitiesController {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    @Autowired
    private SaveOperationBuilder saveOperationBuilder;

    @Autowired
    private DeleteOperationBuilder deleteOperationBuilder;

    @Autowired
    private GetOperationBuilder getOperationBuilder;

    @GetMapping("")
    public Response getEntities(@PathVariable("entity") String entity, String queryJson) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entity);
            if (definition.isPresent()) {
                Repository repository = repositoriesFactory.createForEntity(definition.get().getType());
                Query query = Query.fromJSON(queryJson);
                Result result = repository.find(query);

                return new ValueResponse(result);
            } else {
                return new Response(ResponseCode.NOT_FOUND);
            }
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public Response deleteEntities(@PathVariable("entity") String entityName, String id) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entityName);
            if (definition.isPresent()) {
                DeleteOperation deleteOperation = deleteOperationBuilder.build(definition.get().getType());
                deleteOperation.delete(Arrays.asList(id));

                return new Response(Response.OK);
            } else {
                return new Response(ResponseCode.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @PostMapping("/delete")
    public Response deleteEntitiesMultiple(@PathVariable("entity") String entityName, String ids) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entityName);
            if (definition.isPresent()) {
                DeleteOperation deleteOperation = deleteOperationBuilder.build(definition.get().getType());
                deleteOperation.delete(Arrays.asList(ids.split(",")));

                return new Response(Response.OK);
            } else {
                return new Response(ResponseCode.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @GetMapping("/{id}")
    public Response getEntity(@PathVariable("entity") String entityName, @PathVariable("id") Object id) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entityName);
            if (definition.isPresent()) {
                GetOperation getOperation = getOperationBuilder.build(definition.get().getType());
                ObjectNode node = getOperation.get(id);

                return new ValueResponse(node);
            } else {
                return new Response(ResponseCode.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @PostMapping("")
    public Response saveEntity(@PathVariable("entity") String entity, @RequestBody ObjectNode data) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entity);
            if (definition.isPresent()) {
                SaveOperation saveOperation = saveOperationBuilder.build(definition.get().getType());
                saveOperation.save(data);

                return new Response(Response.OK);
            } else {
                return new Response(ResponseCode.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }
}
