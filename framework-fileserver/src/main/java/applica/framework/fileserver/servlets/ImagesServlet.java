package applica.framework.fileserver.servlets;

import applica.framework.fileserver.*;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 11:30 AM
 */
public class ImagesServlet extends HttpServlet {

    private ImagesService imagesService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        String basePath = config.getInitParameter("basePath");
        String maxSize = config.getInitParameter("maxSize");
        imagesService = new ImagesService(basePath, maxSize);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PathResolver pathResolver = new PathResolver();
        String path = pathResolver.resolve(request);
        String size = request.getParameter("size");
        InputStream inputStream = null;
        try {
            inputStream = imagesService.get(path, size);
            if(inputStream == null) {
                response.setStatus(404);
            } else {
                String fileName = FilenameUtils.getName(path);
                String extension = FilenameUtils.getExtension(fileName);
                response.setContentType(MimeUtils.getMimeType(extension));
                response.setHeader("Content-disposition", String.format("filename=%s", fileName));
                response.setStatus(200);
                IOUtils.copy(inputStream, response.getOutputStream());
            }
        } finally {
            if(inputStream != null) {
                IOUtils.closeQuietly(inputStream);
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PathResolver pathResolver = new PathResolver();
        InputStreamResolver inputStreamResolver = new InputStreamResolver();

        String path = pathResolver.resolve(request);
        InputStream inputStream = inputStreamResolver.resolve(request);
        boolean overwrite = false;
        try {
            overwrite = Boolean.parseBoolean(request.getParameter("overwrite"));
        } catch (Exception ex) {}

        try {
            imagesService.save(path, inputStream, overwrite);
        } catch (BadImageException e) {
            response.setHeader("Fileserver-Error", "bad image");
            throw new ServletException(e);
        } catch(Exception e) {
            response.setHeader("Fileserver-Error", e.getMessage());
            throw new ServletException(e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PathResolver pathResolver = new PathResolver();
        String path = pathResolver.resolve(request);

        try {
            imagesService.delete(path);
        } catch(Exception e) {
            response.setHeader("Fileserver-Error", e.getMessage());
            throw new ServletException(e);
        }
    }
}
