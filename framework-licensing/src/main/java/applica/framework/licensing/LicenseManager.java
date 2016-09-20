package applica.framework.licensing;

import org.apache.commons.io.IOUtils;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Objects;

/**
 * Created by bimbobruno on 12/10/15.
 */
public class LicenseManager {

    private static LicenseManager s_instance;

    public static LicenseManager instance() {
        if (s_instance == null) {
            s_instance = new LicenseManager();
        }

        return s_instance;
    }

    private LicenseManager() {

    }

    public static final String LICENSE_FILE = "applicaframework.lic";

    private String user;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void generateLicenseFile(String user, Date validity, String path) throws LicenseGenerationException {
        License license = new License(user, validity);
        license.generate();

        FileOutputStream out = null;
        try {
            out = new FileOutputStream(path);
            IOUtils.write(license.getBytes(), out);
        } catch (FileNotFoundException e) {
            throw new LicenseGenerationException(e);
        } catch (IOException e) {
            throw new LicenseGenerationException(e);
        } finally {
            if (out != null) {
                IOUtils.closeQuietly(out);
            }
        }
    }

    public void validate() throws InvalidLicenseException {
        Objects.requireNonNull(user);

        InputStream in = getClass().getResourceAsStream("/".concat(LICENSE_FILE));
        if (in == null) {
            throw new LicenseException(LICENSE_FILE + " not found");
        }

        try {
            byte[] bytes = IOUtils.toByteArray(in);
            License license = new License(user, bytes);
            license.validate();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(in);
        }
    }

    public void mustBeValid() {
        try {
            validate();
        } catch (InvalidLicenseException e) {
            throw new RuntimeException(e);
        }
    }

}
