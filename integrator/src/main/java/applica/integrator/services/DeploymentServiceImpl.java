package applica.integrator.services;

import applica.framework.Filter;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.Result;
import applica.integrator.model.Deployment;
import applica.integrator.model.Filters;
import org.springframework.stereotype.Service;


@Service
public class DeploymentServiceImpl implements DeploymentService, Runnable {

    public static final int DELAY = 1 * 60 * 1000; //one minutes

    private Thread thread;
    private boolean running;

    @Override
    public Result<Deployment> findDeployments() {
        return Repo.of(Deployment.class).find(Query.build());
    }

    @Override
    public void addDeployment(String name, String gitRepositoryUrl, String branch) {
        Deployment deployment = new Deployment();
        deployment.setName(name);
        deployment.setBranch(branch);
        deployment.setGitRepositoryUrl(gitRepositoryUrl);

        Repo.of(Deployment.class).save(deployment);
    }

    @Override
    public void deleteDeployment(String name) {
        Repo.of(Deployment.class)
                .find(Query.build().eq(Filters.DEPLOYMENT_NAME, name))
                .findFirst()
                .ifPresent(d -> Repo.of(Deployment.class).delete(d.getId()));
    }

    @Override
    public void start() {
        running = true;
        thread = new Thread(this);
        thread.start();
    }

    @Override
    public void run() {
        while (running) {
            Repo.of(Deployment.class)
                    .find(Query.build().eq(Filters.DEPLOYMENT_ACTIVE, true))
                    .getRows()
                    .forEach(deployment -> {
                        updateDeployment(deployment);
                    });
        }
    }

    private void updateDeployment(Deployment deployment) {
        
    }

    @Override
    public void stop() {
        running = false;
    }
}
