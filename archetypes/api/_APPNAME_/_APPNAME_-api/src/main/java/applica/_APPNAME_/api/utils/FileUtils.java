package applica._APPNAME_.api.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.fileserver.FileServer;
import applica.framework.fileserver.MimeUtils;
import applica.framework.library.options.OptionsManager;
import applica.framework.widgets.mapping.Attachment;
import fr.opensagres.poi.xwpf.converter.pdf.PdfConverter;
import fr.opensagres.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.tika.Tika;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;
import org.apache.axis.encoding.Base64;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static applica._APPNAME_.api.utils.FileType.*;


public class FileUtils {

    public static String getHumanReadableSize(long size) {
        return org.apache.commons.io.FileUtils.byteCountToDisplaySize(size);
    }

    public static InputStream getResourceFileInputStream(String resourcePath) throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(resourcePath);
        return classPathResource.getInputStream();
    }

    public static void convertToPDF(InputStream doc, String pdfPath) {
        File file = new File(pdfPath);
        convertToPDF(doc, file);
    }

    public static void convertToPDF(InputStream doc, File pdfPath) {
        try {
            XWPFDocument document = new XWPFDocument(doc);
            PdfOptions options = PdfOptions.create();
            OutputStream out = new FileOutputStream(pdfPath);
            PdfConverter.getInstance().convert(document, out, options);
            System.out.println("Done");
        } catch (FileNotFoundException ex) {
            System.out.println(ex.getMessage());
        } catch (IOException ex) {

            System.out.println(ex.getMessage());
        }
    }

    public static String getFileType(String path) {
        Tika tika = new Tika();
        String mimeType = tika.detect(path);
        if (mimeType.startsWith("audio/"))
            return AUDIO;
        else if (mimeType.startsWith("image/"))
            return IMAGE;
        else if (mimeType.startsWith("video/"))
            return VIDEO;
        return FILE;
    }

    public static String getFileType(InputStream inputStream, String fileName) {
        Tika tika = new Tika();
        try {
            String mimeType = tika.detect(inputStream, fileName);
            if (mimeType.startsWith("audio/"))
                return AUDIO;
            else if (mimeType.startsWith("image/"))
                return IMAGE;
            else if (mimeType.startsWith("video/"))
                return VIDEO;
            return FILE;

        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static Attachment generateAttachmentFromByteArray(byte[] attachmentByte, String filename, String fileServerPath) throws IOException {
        Attachment attachment = null;

        if (attachmentByte != null && attachmentByte.length > 0 && StringUtils.hasLength(filename) && StringUtils.hasLength(fileServerPath)) {
            InputStream stream = new ByteArrayInputStream(attachmentByte);
            FileServer fileServer = ApplicationContextProvider.provide().getBean(FileServer.class);


            String file = fileServer.saveFile(fileServerPath, FilenameUtils.getExtension(filename), stream);
            long size = attachmentByte.length;
            attachment = new Attachment();
            attachment.setName(filename);
            attachment.setSize(size);
            attachment.setPath(file);
        }

        return attachment;
    }

    public static Attachment generateAttachmentFromBase64(String imageData, String filename, String fileServerPath) throws IOException {
        Attachment attachment = null;

        if (StringUtils.hasLength(imageData) && StringUtils.hasLength(filename) && StringUtils.hasLength(fileServerPath)) {
            byte[] data = Base64.decode(imageData);
            InputStream stream = new ByteArrayInputStream(data);
            FileServer fileServer = ApplicationContextProvider.provide().getBean(FileServer.class);


            String file = fileServer.saveFile(fileServerPath, FilenameUtils.getExtension(filename), stream);
            long size = fileServer.getFileSize(file);
            attachment = new Attachment();
            attachment.setName(filename);
            attachment.setSize((int) size);
            attachment.setPath(file);
        }

        return attachment;
    }


    public static void deleteFromFileserver(String previousImage) {
        if (StringUtils.hasLength(previousImage)) {
            FileServer fileServer = ApplicationContextProvider.provide().getBean(FileServer.class);
            try {
                fileServer.deleteFile(previousImage);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void downloadAndRenameFile(String filename, String filePath, HttpServletResponse response) throws IOException {
        FileServer fileServer = ApplicationContextProvider.provide().getBean(FileServer.class);
        InputStream fileInputStream = fileServer.getFile(filePath);
        downloadFile(fileInputStream, filename, response);
    }

    public static void downloadAndRenameFile(String filename, InputStream fileInputStream, HttpServletResponse response) throws IOException {
        downloadFile(fileInputStream, filename, response);
    }

    public static void downloadFile(InputStream fileInputStream, String fileName, HttpServletResponse response) throws IOException {
        response.setContentType(MimeUtils.getMimeType(FilenameUtils.getExtension(fileName)));
        response.setHeader("Content-disposition", String.format("attachment; filename=\"%s\"", fileName.replaceAll("\\s+", "_")));
        response.setStatus(200);
        IOUtils.copy(fileInputStream, response.getOutputStream());
        fileInputStream.close();
    }

    public static String getAttachmentFullUrl(String path) {
        if (path == null)
            return null;
        OptionsManager optionsManager = ApplicationContextProvider.provide().getBean(OptionsManager.class);
        return String.format("%s%s", optionsManager.get("fileserver.base"), path );
    }

}
