package applica.integrator.controllers;

import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.integrator.services.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static applica.framework.library.responses.Response.OK;

@RestController
public class MainController {

    @Autowired
    private DeploymentService deploymentService;

    @GetMapping("/deployments")
    Response findDeployments() {
        return new ValueResponse(deploymentService.findDeployments());
    }

    @PostMapping("/deployments")
    Response addDeployment(String name, String gitRepositoryUrl, String branch, String script) {
        deploymentService.addDeployment(name, gitRepositoryUrl, branch, script);
        return new Response(OK);
    }

    @DeleteMapping("/deployments/{name}")
    Response deleteDeployment(@PathVariable String name) {
        deploymentService.deleteDeployment(name);
        return new Response(OK);
    }

    @GetMapping("/deployments/{name}/trigger")
    Response trigger(@PathVariable String name) {
        deploymentService.updateDeployment(name);
        return new Response(OK);
    }


}
