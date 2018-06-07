package applica.integrator.model;

import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class GitRepository {

    @Autowired
    private OptionsManager options;

    @Autowired
    private Logger logger;

    public boolean initialized(Deployment deployment) {
        //if sources base exists, so project is already cloned
        File file = new File(getSourcesBase(deployment));

        if (file.exists() && file.isDirectory()) {
            return true;
        }

        return false;
    }

    public void initialize(Deployment deployment) throws ProcessException {
        if (initialized(deployment)) {
            return;
        }

        try {
            ProcessOutput clone = ProcessUtils.exec("git", "clone", deployment.getGitRepositoryUrl(), getSourcesBase(deployment));

            if (clone.getExitCode() != 0) {
                throw new ProcessException(clone);
            }

            ProcessOutput checkout = ProcessUtils.exec("git", "checkout", deployment.getBranch());

            if (checkout.getExitCode() != 0) {
                throw new ProcessException(checkout);
            }
        } catch (IOException e) {
            throw new ProcessException(e);
        } catch (InterruptedException e) {
            throw new ProcessException(e);
        }
    }

    public static String getRevision(Deployment deployment) throws ProcessException {
        try {
            ProcessOutput rev = ProcessUtils.exec("git", "rev-parse", deployment.getBranch());

            if (rev.getExitCode() != 0) {
                throw new ProcessException(rev);
            }

            return rev.getOut().get(0);
        } catch (IOException e) {
            throw new ProcessException(e);
        } catch (InterruptedException e) {
            throw new ProcessException(e);
        }
    }

    public void update(Deployment deployment) throws RepositoryNotInitializedException, ProcessException {
        if (!initialized(deployment)) {
            throw new RepositoryNotInitializedException(deployment);
        }

        try {
            ProcessOutput clone = ProcessUtils.exec("git", "pull", "origin", deployment.getBranch());

            if (clone.getExitCode() != 0) {
                throw new ProcessException(clone);
            }
        } catch (IOException e) {
            throw new ProcessException(e);
        } catch (InterruptedException e) {
            throw new ProcessException(e);
        }
    }

    public String getSourcesBase(Deployment deployment) {
        String sourcesBase = FilenameUtils.concat(options.get("applica.integrator.base"), "sources");

        return FilenameUtils.concat(sourcesBase, deployment.getName());
    }
}
