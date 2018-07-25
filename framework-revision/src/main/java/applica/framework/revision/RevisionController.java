package applica.framework.revision;

import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.framework.revision.services.RevisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Applica (www.applicadoit.com)
 * User: bimbobruno
 * Date: 4/17/13
 * Time: 5:47 PM
 */
@RestController
@RequestMapping("/revision")
public class RevisionController{

    @Autowired
    private RevisionService revisionService;


    @GetMapping("/checkStatus/{entity}")
    public Response getUserProfile(@PathVariable String entity) {
        try {
            return new ValueResponse(revisionService.isRevisionEnabled(entity));
        }  catch (Exception e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

}
