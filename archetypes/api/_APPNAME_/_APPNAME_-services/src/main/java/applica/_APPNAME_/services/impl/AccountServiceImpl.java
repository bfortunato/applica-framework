package applica._APPNAME_.services.impl;

import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.exceptions.*;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.Query;
import applica.framework.ValidationException;
import applica.framework.library.mail.MailUtils;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.security.PasswordUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

/**
 * Created by bimbobruno on 15/11/2016.
 */
@Service
public class AccountServiceImpl implements AccountService {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private OptionsManager options;

    @Override
    public void register(String name, String email, String password) throws MailAlreadyExistsException, MailNotValidException, PasswordNotValidException, ValidationException {
        if (StringUtils.isEmpty(name) || StringUtils.isEmpty(email) || StringUtils.isEmpty(password)) {
            throw new ValidationException(null);
        }

        final String mail = email.trim().toLowerCase();

        //check user existance
        if (usersRepository.find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().isPresent()) {
            throw new MailAlreadyExistsException();
        }

        if (!MailUtils.isValid(mail)) {
            throw new MailNotValidException();
        }

        if (!PasswordUtils.isValid(password)) {
            throw new PasswordNotValidException();
        }

        String activationCode = UUID.randomUUID().toString();
        String encodedPassword = new Md5PasswordEncoder().encodePassword(password, null);

        User user = new User();
        user.setName(name);
        user.setMail(mail);
        user.setPassword(encodedPassword);
        user.setActivationCode(activationCode);
        user.setActive(false);
        user.setRegistrationDate(new Date());

        Role role = getOrCreateRole(Role.USER);
        user.setRoles(Arrays.asList(role));

        usersRepository.save(user);

        String activationUrl = String.format("%saccount/confirm?activationCode=%s", options.get("frontend.public.url"), user.getActivationCode());
        final TemplatedMail templatedMail = new TemplatedMail();
        templatedMail.setOptions(options);
        templatedMail.setMailFormat(TemplatedMail.HTML);
        templatedMail.setTemplatePath("mailTemplates/register.vm");
        templatedMail.setFrom(options.get("registration.mail.from"));
        templatedMail.setSubject(options.get("registration.mail.subject"));
        templatedMail.setTo(mail);
        templatedMail.put("password", password);
        templatedMail.put("mail", mail);
        templatedMail.put("activationUrl", activationUrl);

        sendTemplatedMail(templatedMail);
    }

    @Override
    public void confirm(String activationCode) throws MailNotFoundException {
        User user = usersRepository.find(Query.build().eq(Filters.USER_ACTIVATION_CODE, activationCode)).findFirst().orElseThrow(MailNotFoundException::new);
        user.setActive(true);

        usersRepository.save(user);
    }

    @Override
    public void resetPassword(String mail) throws MailNotFoundException {
        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().orElseThrow(MailNotFoundException::new);

        String newPassword = PasswordUtils.generateRandom();
        user.setPassword(newPassword);

        TemplatedMail templatedMail = new TemplatedMail();
        templatedMail.setOptions(options);
        templatedMail.setMailFormat(TemplatedMail.HTML);
        templatedMail.setTemplatePath("mailTemplates/resetPassword.vm");
        templatedMail.setFrom(options.get("registration.mail.from"));
        templatedMail.setSubject(options.get("registration.mail.subject"));
        templatedMail.setTo(mail);
        templatedMail.put("password", newPassword);
        templatedMail.put("mail", mail);

        sendTemplatedMail(templatedMail);
    }

    @Override
    public void delete(Object id) throws UserNotFoundException {
        usersRepository.delete(id);
    }

    private void sendTemplatedMail(TemplatedMail templatedMail) {
        new Thread(() -> {
            try {
                templatedMail.send();
            } catch (Exception e) {
                e.printStackTrace();
                logger.info(String.format("Error sending mail to %s", templatedMail.getTo()));
            }
        }).run();
    }

    private Role getOrCreateRole(String roleName) {
        return rolesRepository.find(Query.build().filter(Filters.ROLE_NAME, roleName))
                .findFirst()
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRole(roleName);
                    rolesRepository.save(newRole);
                    return newRole;
                });
    }



}
