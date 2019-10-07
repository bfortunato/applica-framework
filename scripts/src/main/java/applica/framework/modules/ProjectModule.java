package applica.framework.modules;

import applica.framework.AppContext;
import applica.framework.Applica;
import applica.framework.cli.Module;
import applica.framework.cli.SystemUtils;
import applica.framework.annotations.Action;
import applica.framework.editors.FileEditor;
import applica.framework.library.utils.FileWalker;
import applica.framework.library.utils.FileWalkerListener;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.util.Assert;

import java.io.*;
import java.util.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 19:02
 */
@applica.framework.annotations.Module("project")
public class ProjectModule implements Module {

    void p(String message, Object... params) {
        System.out.println(String.format(message, params));
    }

    private static String removeFirstSlash(String path) {
        if (path.startsWith("/")) {
            return path.substring(1);
        }

        return path;
    }

    @Action(value = "init", description = "Initialize a new app with specified name")
    public void init(Properties properties) throws GitAPIException, IOException {
        Assert.isTrue(properties.containsKey("name"), "missing name. Specify --name <value>");
        Assert.isTrue(properties.containsKey("archetype"), "missing archetype. Specify --archetype <value>");

        String appName = (String) properties.get("name");
        String archetype = (String) properties.get("archetype");

        p("Creating %s with %s archetype...", appName, archetype);

        String repositoryUrl;
        String destination = String.format("./%s", appName);

        if (archetype.startsWith("http:\\") || archetype.startsWith("https://")) {
            repositoryUrl = archetype;

            p("Cloning %s into %s", repositoryUrl, appName);

            Git.cloneRepository()
                    .setURI(repositoryUrl)
                    .setDirectory(new File(destination))
                    .call();
        } else {
            repositoryUrl = Applica.FRAMEWORK_ARCHETYPES_REPOSITORY_URL.replace("{archetype}", archetype);

            p("Cloning %s into %s", repositoryUrl, appName);

            Git.cloneRepository()
                    .setURI(repositoryUrl)
                    .setDirectory(new File(destination))
                    .setBranch(Applica.VERSION)
                    .call();
        }

        FileUtils.deleteDirectory(new File(String.format("%s/.git", destination)));

        p("Project %s created into %s", archetype, destination);
    }

}
