package applica._APPNAME_.frontend.facade;


import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.domain.model.User;
import applica.framework.ValidationException;
import applica.framework.LoadRequest;
import applica.framework.library.i18n.Localized;
import applica.framework.library.mail.MailException;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.ValidationUtils;
import applica.framework.library.utils.WebUtils;
import applica.framework.security.PasswordUtils;
import applica._APPNAME_.frontend.validation.UIRegistrationValidator;
import applica._APPNAME_.frontend.viewmodel.UIRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.util.Arrays;
import java.util.UUID;

/**
 * http://www.applica.guru
 * User: Bruno Fortunato
 * Date: 4/19/13
 * Time: 1:20 PM
 * Applica
 */

@Component
public class AccountFacade extends Localized {

    @Autowired
    private UIRegistrationValidator registrationValidator;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private OptionsManager options;

    public void register(UIRegistration data) throws ValidationException {
        ValidationUtils.validate(registrationValidator, data, getLocalization());

        String activationCode = UUID.randomUUID().toString();
        String encodedPassword = new Md5PasswordEncoder().encodePassword(data.getPassword(), null);

        User user = new User();
        user.setMail(data.getMail());
        user.setPassword(encodedPassword);
        user.setActive(false);
        user.setActivationCode(activationCode);

        Role role = getOrCreateRole(Role.USER);
        user.setRoles(Arrays.asList(role));

        usersRepository.save(user);

        String activationUrl = WebUtils.mapPublicPath(String.format("account/activate?activationCode=%s", user.getActivationCode()));

        new Thread(() -> {
            TemplatedMail mail = new TemplatedMail();
            mail.setOptions(options);
            mail.setMailFormat(TemplatedMail.HTML);
            mail.setTemplatePath("mailTemplates/register.vm");
            mail.setFrom(options.get("registration.mail.from"));
            mail.setSubject(options.get("registration.mail.subject"));
            mail.setTo(data.getMail());
            mail.put("password", data.getPassword());
            mail.put("activationUrl", activationUrl);
            mail.put("mail", mail);
            try {
                mail.send();
            } catch (MailException e) {
                e.printStackTrace();
                throw new ProgramException("Error sending registration mail");
            } catch (MessagingException e) {
                e.printStackTrace();
                throw new ProgramException("Error sending registration mail");
            }
        }).start();

    }

    public void activate(String activationCode) {
        User user = usersRepository.find(LoadRequest.build().eq(Filters.USER_ACTIVATION_CODE, activationCode)).findFirst().get();
        if(user != null) {
            user.setActive(true);
            usersRepository.save(user);
        }
    }

    public void resetPassword(String mail) throws MailNotFoundException {
        User user = usersRepository.find(LoadRequest.build().eq(Filters.USER_MAIL, mail)).findFirst().get();
        if(user == null) {
            throw new MailNotFoundException();
        }

        String newPassword = PasswordUtils.generateRandom();
        user.setPassword(newPassword);

        String activationUrl = WebUtils.mapPublicPath(String.format("account/activate?activationCode=%s", user.getActivationCode()));
        TemplatedMail tmail = new TemplatedMail();
        tmail.setOptions(options);
        tmail.setMailFormat(TemplatedMail.HTML);
        tmail.setTemplatePath("mailTemplates/resetPassword.vm");
        tmail.setFrom(options.get("registration.mail.from"));
        tmail.setSubject(options.get("registration.mail.subject"));
        tmail.setTo(mail);
        tmail.put("password", newPassword);
        tmail.put("mail", mail);
        tmail.put("activationUrl", activationUrl);
        try {
            tmail.send();
        } catch (MailException e) {
            e.printStackTrace();
            throw new ProgramException("Error sending reset mail");
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new ProgramException("Error sending reset mail");
        }
    }

    public Role getOrCreateRole(String roleName) {
        return rolesRepository.find(LoadRequest.build().filter(Filters.ROLE_NAME, roleName))
                .findFirst()
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRole(roleName);
                    rolesRepository.save(newRole);
                    return newRole;
                });
    }
}
