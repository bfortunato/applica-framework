package applica.integrator.model;

import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class Logger {

    @Autowired
    private OptionsManager options;

    DateFormat filesFormat = new SimpleDateFormat("yyyy-MM-dd");
    DateFormat timestampFormat = new SimpleDateFormat("HH:mm:ss");

    public void log(Deployment deployment, String messageFormat, Object... params) {
        try {
            FileUtils.write(new java.io.File(getLogPath(deployment)), m(String.format(messageFormat, params)), true);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void log(Deployment deployment, List<String> messages) {
        try {
            FileUtils.writeLines(
                    new java.io.File(getLogPath(deployment)),
                    messages.stream().map(this::m).collect(Collectors.toList()),
                    true
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void log(String messageFormat, Object... params) {
        try {
            FileUtils.write(
                    new java.io.File(getSystemLogPath()),
                    m(String.format(messageFormat, params)),
                    true
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void log(Exception ex) {
        try {

            FileUtils.write(
                    new java.io.File(getSystemLogPath()),
                    m(String.format("Exception raised: \n%s\n", ExceptionUtils.getStackTrace(ex))),
                    true
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private String m(String src) {
        return String.format("[%s] %s\n", timestampFormat.format(new Date()), src);
    }

    public String getLogPath(Deployment deployment) {
        String logsBase = FilenameUtils.concat(options.get("applica.integrator.base"), "logs");
        String deploymentLogBase = FilenameUtils.concat(logsBase, deployment.getName());
        String currentSourcesBase = FilenameUtils.concat(deploymentLogBase, filesFormat.format(new Date()));

        return currentSourcesBase;
    }

    public String getSystemLogPath() {
        String logsBase = FilenameUtils.concat(options.get("applica.integrator.base"), "system");
        String currentSourcesBase = FilenameUtils.concat(logsBase, filesFormat.format(new Date()));

        return currentSourcesBase;
    }
}
