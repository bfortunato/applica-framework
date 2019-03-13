package applica._APPNAME_.api.controllers;


import applica.framework.fileserver.FileServer;
import applica.framework.fileserver.MimeUtils;
import applica.framework.library.responses.Response;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

import static applica._APPNAME_.api.utils.FileUtils.downloadAndRenameFile;

/**
 * Created by bimbobruno on 08/03/2017.
 */
@Controller
@RequestMapping("/fs")
public class FileServerController {

    @Autowired
    private FileServer fileServer;

    @RequestMapping("image")
    public void image(String path, String size, HttpServletResponse response) {
        try (InputStream inputStream = fileServer.getImage(path, size)) {
            if(inputStream == null) {
                response.setStatus(404);
            } else {
                String fileName = FilenameUtils.getName(path);
                String extension = FilenameUtils.getExtension(fileName);
                response.setContentLength(inputStream.available());
                response.setContentType(MimeUtils.getMimeType(extension));
                response.setHeader("Content-disposition", String.format("inline;filename=%s", fileName));
                response.setStatus(200);
                IOUtils.copy(inputStream, response.getOutputStream());
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    @RequestMapping("file")
    public void file(String path, String size, HttpServletResponse response) {
        try (InputStream inputStream = fileServer.getImage(path, size)) {
            if(inputStream == null) {
                response.setStatus(404);
            } else {
                String fileName = FilenameUtils.getName(path);
                String extension = FilenameUtils.getExtension(fileName);
                response.setContentLength(inputStream.available());
                response.setContentType(MimeUtils.getMimeType(extension));
                response.setHeader("Content-disposition", String.format("inline;filename=%s", fileName));
                response.setStatus(200);
                IOUtils.copy(inputStream, response.getOutputStream());
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    @GetMapping("/renameAndDownload")
    public Response renameAndDownload(HttpServletResponse response, String filename, String path) {

        try {
            downloadAndRenameFile(filename, path, response);
            return new Response(Response.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }
}
