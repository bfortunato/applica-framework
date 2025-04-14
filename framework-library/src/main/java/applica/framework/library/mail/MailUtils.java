package applica.framework.library.mail;

import applica.framework.library.options.OptionsManager;
import org.springframework.util.StringUtils;

import javax.mail.Session;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import java.util.Properties;

public class MailUtils {
    public static Session getMailSession(OptionsManager options) {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", options.get("smtp.host"));
        String smtpPort = options.get("smtp.port");
        properties.put("mail.smtp.port", StringUtils.hasLength(smtpPort) ? Integer.parseInt(smtpPort) : 25);
        properties.put("mail.smtp.auth", "true");
        String starttlsEnable = options.get("smtp.starttls.enable");
        if(starttlsEnable!=null) properties.put("mail.smtp.starttls.enable", starttlsEnable);
        String sslSocketFactorPort = options.get("smtp.socketFactory.port");
        if(sslSocketFactorPort!=null) properties.put("mail.smtp.socketFactory.port", sslSocketFactorPort);
        String sslSocketFactorClass = options.get("smtp.socketFactory.class");
        if(sslSocketFactorClass!=null) properties.put("mail.smtp.socketFactory.class", sslSocketFactorClass);

        return Session.getInstance(properties, new OptionsMailAuthenticator(options));
    }

    public static boolean isValid(String mail) {
        if (!StringUtils.hasLength(mail))
            return false;
        boolean result = true;
        try {
            new InternetAddress(mail); // check valid address
            if (!hasNameAndDomain(mail)) {
                result = false;
            }
        } catch (AddressException ex) {
            result = false;
        }
        return result;
    }

    private static boolean hasNameAndDomain(String mail) {
        String[] tokens = mail.split("@");
        return tokens.length == 2 && StringUtils.hasLength(tokens[0])  && StringUtils.hasLength(tokens[1]);
    }
}
