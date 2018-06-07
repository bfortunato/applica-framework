package applica.integrator.services;

import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.Result;
import applica.integrator.model.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;


@Service
public class DeploymentServiceImpl implements DeploymentService {

    public static final int DELAY = 1 * 60 * 1000; //one minutes

    private Thread thread;
    private boolean running;

    @Autowired
    private Logger logger;

    @Autowired
    private GitRepository git;

    @Autowired
    private Builder builder;

    @Override
    public Result<Deployment> findDeployments() {
        return Repo.of(Deployment.class).find(Query.build());
    }

    @Override
    public void addDeployment(String name, String gitRepositoryUrl, String branch, String script) {
        if (StringUtils.isEmpty(name)) {
            throw new IllegalArgumentException("name");
        }

        if (StringUtils.isEmpty(gitRepositoryUrl)) {
            throw new IllegalArgumentException("gitRepositoryUrl");
        }

        if (StringUtils.isEmpty(branch)) {
            throw new IllegalArgumentException("branch");
        }

        Deployment deployment = new Deployment();
        deployment.setName(name);
        deployment.setBranch(branch);
        deployment.setGitRepositoryUrl(gitRepositoryUrl);
        deployment.setScript(script);
        deployment.setActive(true);

        Repo.of(Deployment.class).save(deployment);

        logger.log("Deployment created: " + deployment.getName());
        logger.log(deployment, "Created");
    }

    @Override
    public void deleteDeployment(String name) {
        Deployment deployment = Repo.of(Deployment.class)
                .find(Query.build().eq(Filters.DEPLOYMENT_NAME, name))
                .findFirst()
                .orElse(null);

        if (deployment == null) {
            return;
        }

        logger.log("Deployment deleted: " + name);
        logger.log(deployment, "Deleted");
    }

    public void updateDeployment(String name) {
        Deployment deployment = Repo.of(Deployment.class)
                .find(Query.build().eq(Filters.DEPLOYMENT_NAME, name))
                .findFirst()
                .orElse(null);

        if (deployment == null) {
            return;
        }

        logger.log(deployment, "Received update request on %s (%s)", deployment.getGitRepositoryUrl(), deployment.getBranch());

        if (!git.initialized(deployment)) {
            logger.log(deployment,"Initializing %s", deployment.getName());

            try {
                git.initialize(deployment);
            } catch (ProcessException e) {
                logger.log(deployment,"Error initializing git repository");
                logProcessException(deployment, e);

                return;
            }

            logger.log(deployment, "Repository initialized");
        }

        logger.log(deployment,"Updating %s", deployment.getName());

        try {
            git.update(deployment);
        } catch (ProcessException e) {
            logger.log(deployment, "Error updating git repository");
            logProcessException(deployment, e);

            return;
        } catch (RepositoryNotInitializedException e) {
            logger.log(deployment,"Error updating git repository: not initialized");

            return;
        }

        logger.log(deployment, "Repository updated");

        logger.log(deployment,"Getting revision of %s", deployment.getName());

        String currentRevision = null;
        try {
            currentRevision = git.getRevision(deployment);
        } catch (ProcessException e) {
            logger.log(deployment,"Error getting revision");
            logProcessException(deployment, e);

            return;
        }

        logger.log(deployment, "Revision: %s", currentRevision);

        if (!Objects.equals(currentRevision, deployment.getRevision())) {
            logger.log(deployment,"Building %s", deployment.getName());

            try {
                builder.build(deployment);
            } catch (ProcessException e) {
                logger.log(deployment,"Error building");
                logProcessException(deployment, e);

                return;
            }

            logger.log(deployment, "Build complete");
        }
    }

    private void logProcessException(Deployment deployment, ProcessException e) {
        if (e.getOutput() != null) {
            if (e.getOutput().getOut().size() > 0) {
                logger.log(deployment, "OUTPUT");
                logger.log(deployment, e.getOutput().getOut());
            }
            if (e.getOutput().getErr().size() > 0) {
                logger.log(deployment, "ERROR");
                logger.log(deployment, e.getOutput().getErr());
            }
        } else {
            logger.log(e);
        }
    }
}
