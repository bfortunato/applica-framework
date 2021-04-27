package applica.framework.fileserver;

import applica.framework.fileserver.FileServer;
import applica.framework.library.options.OptionsManager;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.FileHeader;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.AgeFileFilter;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Date;
import java.util.Iterator;
import java.util.UUID;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/23/13
 * Time: 12:20 PM
 */
public class LocalFileserver implements FileServer {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;

    private LocalFilesService filesService;

    private String baseUrl;

    @PostConstruct
    protected void init() {
        baseUrl = options.get("fileserver.base.internal");
        filesService = new LocalFilesService();
        filesService.init(options);
    }

    @Override
    public String saveFile(String path, String extension, InputStream fileStream) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        String generatedName = String.format("%s.%s", UUID.randomUUID().toString().replace("-", "_"), extension);

        logger.info(String.format("Saving file on path %s", path + generatedName));

        return saveToServer(fileStream, generatedName, path, false);
    }

    @Override
    public long getFileSize(String path) {
        File file = new File( baseUrl.concat(path));
        if (file.exists())
            return file.length();
        return 0;
    }

    private String saveToServer(InputStream fileStream, String filename, String path, boolean image) throws IOException {
        String s = String.format("%s/%s", path, filename);
        filesService.doPost(fileStream, s, true);
        return s;
    }

    @Override
    public InputStream getFile(String path) throws IOException {
        return filesService.doGet(path);
    }

    @Override
    public InputStream getImage(String path, String size) throws IOException {
        return filesService.doGet(path);
    }

    @Override
    public void deleteFile(String path) {
        filesService.doDelete(path);
    }

    @Override
    public String saveImage(String path, String extension, InputStream imageStream) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        String generatedName = String.format("%s.%s", UUID.randomUUID().toString().replace("-", "_"), extension);

        logger.info(String.format("Saving file on path %s", path + generatedName));

        return saveToServer(imageStream, generatedName, path, true);
    }

    private NormalizedUrl normalizeUrl(String url) {
        NormalizedUrl normalizedUrl = new NormalizedUrl();
        normalizedUrl.filename = FilenameUtils.getName(url);
        try {
            normalizedUrl.url = String.format("%s%s", FilenameUtils.getFullPath(url), URLEncoder.encode(normalizedUrl.filename, "UTF-8"));
        } catch (Exception ex) {
            normalizedUrl.url = url;
        }

        return normalizedUrl;
    }

    public String copyFile(String filePath, String newPath) throws IOException {
        String extention = FilenameUtils.getExtension(filePath);
        newPath = String.format("%s/%s.%s",newPath, UUID.randomUUID().toString().replace("-", "_"), FilenameUtils.getExtension(filePath));

        InputStream i = getFile(filePath);
        return saveFile(newPath, extention, i);
    }

    public String unzipFile(String filePath) {
        if (!filePath.endsWith(".zip")) {
            throw new RuntimeException("Cannot unzip the file because isn't zip");
        }
        String basePath = options.get("applica.framework.fileserver.basePath");
        String filePathFull = String.format("%s/%s", basePath, filePath);
        ZipFile zipFile = null;
        String destinationPath = null;
        try {
            zipFile = new ZipFile(filePathFull);
            String[] strings = filePath.split("/");
            destinationPath = filePath.replace(strings[strings.length - 1], "");
            zipFile.extractAll(String.format("%s/%s", basePath, destinationPath));

            FileHeader fileHeader = (FileHeader) zipFile.getFileHeaders().get(0);
            String path = String.format("%s%s", destinationPath, fileHeader.getFileName());
            ;
            return path;
        } catch (ZipException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteOldFiles(String directoryPath, int days) {
        String basePath = options.get("applica.framework.fileserver.basePath");
        Date oldestAllowedFileDate = DateUtils.addDays(new Date(), days * (-1)); //minus days from current date
        File targetDir = new File(String.format("%s/%s", basePath, directoryPath));
        Iterator<File> filesToDelete = FileUtils.iterateFiles(targetDir, new AgeFileFilter(oldestAllowedFileDate), null);
        //if deleting subdirs, replace null above with TrueFileFilter.INSTANCE
        while (filesToDelete.hasNext()) {
            FileUtils.deleteQuietly(filesToDelete.next());
        }  //I don't want an exception if a file is not deleted. Otherwise use filesToDelete.next().delete() in a try/catch
    }

    @Override
    public boolean exists(String path) {
        try {
            return getFile(path) != null;
        } catch (IOException e) {
            return false;
        }
    }

    private class NormalizedUrl {
        private String url;
        private String filename;
    }
}

