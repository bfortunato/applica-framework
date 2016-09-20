package applica.framework.fileserver;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 12:27 PM
 */
public class InputStreamResolver {

    /**
     * Gets input stream of uploaded file. Note: the input stream must be closes from the client
     * @param request
     * @return
     */
    public InputStream resolve(HttpServletRequest request) {
        Assert.isTrue(ServletFileUpload.isMultipartContent(request), "Request must be multipart");

        InputStream inputStream = null;

        FileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            for(FileItem item : items) {
                if(!item.isFormField()) {
                    inputStream = item.getInputStream();
                }
            }
        } catch (FileUploadException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return inputStream;
    }

}
