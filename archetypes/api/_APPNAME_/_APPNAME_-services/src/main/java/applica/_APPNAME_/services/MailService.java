package applica._APPNAME_.services;

import applica._APPNAME_.domain.model.User;
import applica.framework.library.mail.Recipient;
import applica.framework.library.mail.TemplatedMail;

import java.util.List;

public interface MailService {
    void sendMail(TemplatedMail mail, List<Recipient> recipients);

    void sendActivactionMail(User user, String defaultPassword);
}
