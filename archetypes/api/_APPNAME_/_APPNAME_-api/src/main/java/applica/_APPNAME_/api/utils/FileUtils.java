package applica._APPNAME_.api.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.options.OptionsManager;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;


public class FileUtils {
    public static InputStream getResourceFileInputStream(String resourcePath) throws IOException {
        OptionsManager optionsManager = ApplicationContextProvider.provide().getBean(OptionsManager.class);
        ResourceLoader resourceLoader = ApplicationContextProvider.provide().getBean(ResourceLoader.class);
        Resource res = resourceLoader.getResource("classpath:/" + resourcePath);
        //AesCipher.genKey(res.getFile().getAbsolutePath());
        if (org.springframework.util.StringUtils.hasLength(optionsManager.get("file.getting.mode")) && optionsManager.get("file.getting.mode").equals("jar"))
            return res.getInputStream();
        else {
            return new FileInputStream(res.getFile().getAbsolutePath());
        }
    }

}
