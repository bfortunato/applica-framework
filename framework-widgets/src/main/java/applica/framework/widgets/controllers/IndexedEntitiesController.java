package applica.framework.widgets.controllers;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.data.ConstraintException;
import applica.framework.indexing.core.IndexedResult;
import applica.framework.indexing.services.IndexService;
import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.framework.library.utils.ObjectUtils;
import applica.framework.library.validation.ValidationException;
import applica.framework.library.validation.ValidationResponse;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.framework.widgets.entities.EntityDefinition;
import applica.framework.widgets.factory.OperationsFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestParameterPropertyValues;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;

/**
 * Created by bimbobruno on 06/12/2016.
 */
@RestController
@RequestMapping("/entities/indexed/{entity}")
public class IndexedEntitiesController {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private IndexService indexService;

    ObjectMapper mapper = new ObjectMapper();

    @GetMapping("")
    public Response findIndexedEntities(@PathVariable("entity") String entity, HttpServletRequest request) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entity);
            if (definition.isPresent()) {
                Query query = ObjectUtils.bind(new Query(), new ServletRequestParameterPropertyValues(request));
                IndexedResult search = indexService.search(definition.get().getType(), query);

                ObjectNode result = mapper.createObjectNode();
                ArrayNode rows = result.putArray("rows");
                result.put("totalRows", search.getTotalRows());
                search.getRows().forEach(d -> rows.add(d.toObjectNode(mapper)));

                return new ValueResponse(result);
            } else {
                logger.warn("Entity definition not found: " + entity);
                return new Response(Response.ERROR_NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @PostMapping("/find")
    public Response findIndexedEntities(@PathVariable("entity") String entity, @RequestBody Query query) {
        try {
            Optional<EntityDefinition> definition = EntitiesRegistry.instance().get(entity);
            if (definition.isPresent()) {
                IndexedResult search = indexService.search(definition.get().getType(), query);

                ObjectNode result = mapper.createObjectNode();
                ArrayNode rows = result.putArray("rows");
                result.put("totalRows", search.getTotalRows());
                search.getRows().forEach(d -> rows.add(d.toObjectNode(mapper)));

                return new ValueResponse(result);
            } else {
                logger.warn("Entity definition not found: " + entity);
                return new Response(Response.ERROR_NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }
}
