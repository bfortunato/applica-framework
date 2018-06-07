package applica.integrator.model;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class Builder {

    @Autowired
    private GitRepository git;

    public void build(Deployment deployment) throws ProcessException {
        if (!git.initialized(deployment)) {
            git.initialize(deployment);
        }

        String sourcesBase = git.getSourcesBase(deployment);
        String buildScript = FilenameUtils.concat(sourcesBase, deployment.getScript());

        try {
            ProcessOutput build = ProcessUtils.exec("/bin/bash", buildScript);

            if (build.getExitCode() != 0) {
                throw new ProcessException(build);
            }
        } catch (IOException e) {
            throw new ProcessException(e);
        } catch (InterruptedException e) {
            throw new ProcessException(e);
        }
    }

}
