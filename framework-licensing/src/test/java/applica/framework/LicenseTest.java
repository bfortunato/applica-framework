package applica.framework;

import applica.framework.licensing.Encryptor;
import applica.framework.licensing.InvalidLicenseException;
import applica.framework.licensing.License;
import applica.framework.licensing.LicenseGenerationException;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.Calendar;

public class LicenseTest {

    @Test
    public void testCrypo() throws Exception {
        Encryptor e = new Encryptor("bruno");
        String enc = e.encrypt("bruno");

        System.out.println(enc);

        Assert.assertEquals("bruno", e.decrypt(enc));
    }

    @Test
    public void testGenerateAndCheck() throws LicenseGenerationException, InvalidLicenseException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, 1);
        License license = new License("bruno", calendar.getTime());
        license.generate();

        System.out.println(Arrays.toString(license.getBytes()));

        License check = new License("bruno", license.getBytes());
        check.validate();
    }

}
