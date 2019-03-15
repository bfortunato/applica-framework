package applica.framework;

import applica.framework.licensing.Encryptor;
import applica.framework.licensing.InvalidLicenseException;
import applica.framework.licensing.License;
import applica.framework.licensing.LicenseGenerationException;
import org.junit.Assert;
import org.junit.Test;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Calendar;

public class LicenseTest {

    @Test
    public void testCrypo() throws Exception {
        Encryptor e = new Encryptor("bruno");
        byte[] enc = e.encrypt("bruno".getBytes(StandardCharsets.UTF_8));

        System.out.println(enc.toString());

        Assert.assertEquals("bruno", new String(e.decrypt(enc), StandardCharsets.UTF_8));
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
