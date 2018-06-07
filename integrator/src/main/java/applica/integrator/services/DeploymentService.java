package applica.integrator.services;

import applica.framework.Result;
import applica.integrator.model.Deployment;

import java.util.List;

public interface DeploymentService {

    Result<Deployment> findDeployments();
    void addDeployment(String name, String gitRepositoryUrl, String branch);
    void deleteDeployment(String name);

    void start();

    void stop();
}
