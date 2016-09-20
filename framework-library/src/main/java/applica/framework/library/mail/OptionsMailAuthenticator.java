package applica.framework.library.mail;

import applica.framework.library.options.OptionsManager;

import javax.mail.PasswordAuthentication;

public class OptionsMailAuthenticator extends javax.mail.Authenticator {
    private PasswordAuthentication authentication;

    public OptionsMailAuthenticator(OptionsManager options) {
        String username = options.get("smtp.username");
        String password = options.get("smtp.password");
        authentication = new PasswordAuthentication(username, password);
    }

    protected PasswordAuthentication getPasswordAuthentication() {
        return authentication;
    }
}