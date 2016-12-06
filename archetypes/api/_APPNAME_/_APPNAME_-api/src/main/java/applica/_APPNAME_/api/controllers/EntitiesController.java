package applica._APPNAME_.api.controllers;

import applica.framework.*;
import applica.framework.entities.EntitiesRegistry;
import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by bimbobruno on 06/12/2016.
 */
@RestController
@RequestMapping("/entities/{entity}")
public class EntitiesController {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    @Autowired
    private ApplicationContext context;

    @GetMapping("")
    public Response getEntities(@PathVariable String id, String queryJson) {
        try {
            Class type = EntitiesRegistry.instance().get(id);
            Repository repository = repositoriesFactory.createForEntity(type);
            Query query = Query.fromJSON(queryJson);
            Result result = repository.find(query);
            return new ValueResponse(result);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

}
