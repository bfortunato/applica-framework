package applica.integrator.controllers;

import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.integrator.services.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import static applica.framework.library.responses.Response.OK;

@RestController
public class MainController {

    @Autowired
    private DeploymentService deploymentService;

    @GetMapping("/deployments")
    Response findDeployments() {
        return new ValueResponse(deploymentService.findDeployments());
    }

    @PutMapping("/deployments")
    Response addDeployment(String name, String gitRepositoryUrl, String branch) {
        deploymentService.addDeployment(name, gitRepositoryUrl, branch);
        return new Response(OK);
    }

    @DeleteMapping("/deployments/{name}")
    Response deleteDeployment(String name) {
        deploymentService.deleteDeployment(name);
        return new Response(OK);
    }


}
