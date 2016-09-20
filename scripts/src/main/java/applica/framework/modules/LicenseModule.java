package applica.framework.modules;

import applica.framework.annotations.Action;
import applica.framework.licensing.LicenseGenerationException;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

/**
 * Created by bimbobruno on 13/10/15.
 */
@applica.framework.annotations.Module("license")
public class LicenseModule implements Module {

    void p(String message, Object... params) {
        System.out.println(String.format(message, params));
    }

    @Action(value = "generate", description = "Generate a new license file")
    public void generate(Properties properties) {
        File file = new File(LicenseManager.LICENSE_FILE);
        if (file.exists()) {
            p("Cannot create license file: %s already exists", LicenseManager.LICENSE_FILE);
            return;
        }

        String user = properties.getProperty("user");

        if (StringUtils.isEmpty(user)) {
            p("Please specify a user (-Duser={user}");
            return;
        }

        String dateString = properties.getProperty("validity");

        if (StringUtils.isEmpty(dateString)) {
            p("Please specify a user (-validity={yyyy-MM-dd}");
            return;
        }

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = dateFormat.parse(dateString);
        } catch (ParseException e) {
            p("Bad date format. Use yyyy-MM-dd");
            return;
        }

        if (date != null) {
            try {
                LicenseManager.instance().generateLicenseFile(user, date, file.getAbsolutePath());

                p("License generated: %s", file.getAbsolutePath());
            } catch (LicenseGenerationException e) {
                p("Error generating license file: %s", e.getMessage());
            }
        }
    }

}
