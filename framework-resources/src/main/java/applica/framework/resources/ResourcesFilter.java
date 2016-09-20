package applica.framework.resources;

import applica.framework.library.utils.MimeUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 12:11 PM
 */
public class ResourcesFilter implements Filter {

    private String resourceLoader = "class"; //can be file or class
    private String fileResourceLoaderPath = "/";

    public String getFileResourceLoaderPath() {
        return fileResourceLoaderPath;
    }

    public void setFileResourceLoaderPath(String fileResourceLoaderPath) {
        this.fileResourceLoaderPath = fileResourceLoaderPath;
    }

    public String getResourceLoader() {
        return resourceLoader;
    }

    public void setResourceLoader(String resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        resourceLoader = filterConfig.getInitParameter("resourceLoader");
        fileResourceLoaderPath = filterConfig.getInitParameter("fileResourceLoaderPath");

        if(!StringUtils.hasLength(resourceLoader)) {
            resourceLoader = "class";
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String uri = ((HttpServletRequest) request).getRequestURI();
        String resourcePath = uri
                .replace("/framework-resources", "")
                .replaceFirst(httpRequest.getSession().getServletContext().getContextPath(), "");

        InputStream inputStream = null;
        if(resourceLoader.equals("class")) {
            String path = String.format("/framework/%s", resourcePath).replace("//", "/");
            inputStream = getClass().getResourceAsStream(path);
        } else if(resourceLoader.equals("file")) {
            inputStream = new FileInputStream(String.format("%s/%s", fileResourceLoaderPath, resourcePath).replace("//", "/"));
        } else {
            throw new IOException(String.format("Resource loader %s not available. Please use file or class", resourceLoader));
        }

        if(inputStream != null) {
            String extension = FilenameUtils.getExtension(resourcePath);
            response.setContentType(MimeUtils.getMimeType(extension));
            IOUtils.copy(inputStream, response.getOutputStream());
            IOUtils.closeQuietly(inputStream);
        } else {
            chain.doFilter(request, response);
        }
    }


    @Override
    public void destroy() {

    }
}
