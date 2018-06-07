package applica.integrator.services;

import applica.framework.Result;
import applica.integrator.model.Deployment;
import applica.integrator.model.ProcessException;

import java.util.List;

public interface DeploymentService {

    Result<Deployment> findDeployments();
    void addDeployment(String name, String gitRepositoryUrl, String branch, String script);
    void deleteDeployment(String name);
    void updateDeployment(String name);
}
