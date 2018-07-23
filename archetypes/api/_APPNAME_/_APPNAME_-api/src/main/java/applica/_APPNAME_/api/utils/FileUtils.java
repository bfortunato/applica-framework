package applica._APPNAME_.api.utils;

import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;


public class FileUtils {
    public static InputStream getResourceFileInputStream(String resourcePath) throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(resourcePath);
        return classPathResource.getInputStream();
    }

}