package applica._APPNAME_.api.facade;

import applica._APPNAME_.domain.model.CustomPermissions;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.PasswordRecoveryCode;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.MailService;
import applica._APPNAME_.services.exceptions.CodeNotValidException;
import applica._APPNAME_.services.exceptions.MailNotFoundException;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.library.i18n.LocalizationUtils;
import applica.framework.library.mail.Recipient;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class AccountFacade {

    @Autowired
    private AccountService accountService;

    @Autowired
    private MailService mailService;

    @Autowired
    private OptionsManager optionsManager;

    public void sendRegistrationMail(User user, String tempPassword) {
        mailService.sendActivationMail(user, tempPassword);
    }

    public String encryptAndGetPassword(String password) {
        return accountService.encryptAndGetPassword(password);
    }

    /**
     * Forza il reinvio di una password generata con le stesse politiche adottate in fase di creazione all'utente con id userId
     * @param userId
     * @return
     * @throws AuthorizationException
     */


    public String generateAndSendUserOneTimePassword(String userId) throws AuthorizationException {
        return generateAndSendUserOneTimePassword(Repo.of(User.class).get(userId).get());
    }


    public String generateAndSendUserOneTimePassword(User user) throws AuthorizationException {
        Security.withMe().authorize(CustomPermissions.RESET_USER_PASSWORD);
        String tempPassword = optionsManager.get("password.onetime.value");
        if (!org.springframework.util.StringUtils.hasLength(tempPassword))
            tempPassword = randomAlphaNumeric(8);


        //rimettere a tempPassword a regime
        user.setPassword(encryptAndGetPassword(tempPassword));
        user.setCurrentPasswordSetDate(null);
        Repo.of(User.class).save(user);

        String finalTempPassword = tempPassword;
        new Thread(() -> sendRegistrationMail(user, finalTempPassword)).start();
        return tempPassword;
    }



    public void sendConfirmationCode(String mail) throws MailNotFoundException {
        User user = Repo.of(User.class).find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().orElseThrow(MailNotFoundException::new);

        PasswordRecoveryCode passwordRecoveryCode = accountService.getPasswordRecoverForUser(user.getSid());

        if(passwordRecoveryCode == null){
            passwordRecoveryCode = new PasswordRecoveryCode();
            passwordRecoveryCode.setUserId(user.getSid());
        }

        String code = randomAlphaNumeric(5);
        passwordRecoveryCode.setCode(code);

        accountService.savePasswordRecoveryCode(passwordRecoveryCode);
        sendPasswordRecoveryCodeMail(user.getMail(), user.getFullName(), passwordRecoveryCode);
    }

    private static String randomAlphaNumeric(int count) {
        String ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder builder = new StringBuilder();
        while (count-- != 0) {
            int character = (int)(Math.random()*ALPHA_NUMERIC_STRING.length());
            builder.append(ALPHA_NUMERIC_STRING.charAt(character));
        }
        return builder.toString();
    }


    private void sendPasswordRecoveryCodeMail(String mail, String name, PasswordRecoveryCode passwordRecoveryCode) {

        String template = "mailTemplates/passwordRecoveryCode.vm";
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("code", passwordRecoveryCode.getCode());

        mailService.createAndSendMail(template, TemplatedMail.HTML, LocalizationUtils.getInstance().getMessage("subject.password.recovery.code"), Arrays.asList(new Recipient(mail, Recipient.TYPE_TO)), data);

    }
}
