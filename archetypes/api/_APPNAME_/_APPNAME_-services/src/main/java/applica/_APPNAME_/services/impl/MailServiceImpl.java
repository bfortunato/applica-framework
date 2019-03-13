package applica._APPNAME_.services.impl;

import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.MailService;
import applica.framework.library.mail.MailUtils;
import applica.framework.library.mail.Recipient;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.ProgramException;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.helper.StringUtil;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class MailServiceImpl implements MailService {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager optionsManager;

    @Override
    public TemplatedMail createMail(String templatePath, int mailType, String subject, Map<String, Object> data) {
        TemplatedMail mail = new TemplatedMail();
        mail.setOptions(optionsManager);
        mail.setMailFormat(mailType);
        mail.setTemplatePath(templatePath);
        mail.setFrom(optionsManager.get("registration.mail.from"));
        mail.setSubject(subject);
        for (String key: data.keySet()) {
            mail.put(key, data.get(key));
        }
        return mail;
    }



    //TODO:lambda
    @Override
    public void sendMail(TemplatedMail mail, List<Recipient> recipients) {

        if (optionsManager.get("testmode").equals("ON")) {
            for (Recipient recipient: recipients) {
                recipient.setRecipient(optionsManager.get("testmode.recipient.mail"));
            }
        }
        for (Recipient recipient: recipients) {
            try {
                mail.setRecipients(Collections.singletonList(recipient));
                mail.send();
                logger.info(String.format("Email '%s' correttamente inviata in data %s a %s", mail.getSubject(), new Date(), recipient.getRecipient()));
            } catch (Exception e) {
                e.printStackTrace();
                throw new ProgramException(String.format("Errore durante l'invio della mail '%s' a %s: %s", mail.getSubject(), recipient.getRecipient(),e.getMessage()));

            }

        }
    }



    @Override
    public void sendActivationMail(User user, String defaultPassword) {
        Map<String, Object> data = new HashMap<>();

        String loginUrl = String.format("%s/#//login", optionsManager.get("frontend.public.url"));
        data.put("loginUrl", loginUrl);
        data.put("password", defaultPassword);
        data.put("user", user);

        Recipient recipient = new Recipient();
        recipient.setRecipient(user.getMail());
        sendMail(createMail("mailTemplates/userActivation.vm", TemplatedMail.HTML, optionsManager.get("registration.mail.subject"), data), Collections.singletonList(recipient));
    }

    @Override
    public void createAndSendMail(String template, int mailType, String subject, List<Recipient> recipients, Map<String, Object> data) {

        sendMail(createMail(template, mailType, subject, data), recipients);
    }

    private String getAllRecipientsToString(TemplatedMail mail) {
        if (mail.getRecipients() != null) {
          return StringUtil.join(mail.getRecipients().stream().map(Recipient::getRecipient).collect(Collectors.toList()), ",");
        }
        return "";
    }

    //Ottiene la lista di oggetti di tipo Recipient da una lista di utenti passata in parametro, a patto che abbiano il campo "mail" valorizzato
    private List<Recipient> getRecipientsFromUserList(List<User> recipients) {
        if (recipients != null) {
            recipients.removeIf(user -> !MailUtils.isValid(user.getMail()));
            return recipients.stream().map(r -> new Recipient(r.getMail(), Recipient.TYPE_TO)).collect(Collectors.toList());
        }
        return null;
    }


}
