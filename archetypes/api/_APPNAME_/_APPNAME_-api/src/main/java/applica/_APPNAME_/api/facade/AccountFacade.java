package applica._APPNAME_.api.facade;

import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccountFacade {


    @Autowired
    private MailService mailService;

    public void sendRegistrationMail(User user, String tempPassword) {
        mailService.sendActivactionMail(user, tempPassword);
    }
}
