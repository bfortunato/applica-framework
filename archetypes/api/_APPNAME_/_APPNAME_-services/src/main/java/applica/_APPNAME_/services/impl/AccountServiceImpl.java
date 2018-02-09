package applica._APPNAME_.services.impl;

import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.PasswordChange;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.MailService;
import applica._APPNAME_.services.exceptions.*;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.Query;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import applica.framework.library.mail.MailUtils;
import applica.framework.library.mail.Recipient;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.validation.Validation;
import applica.framework.library.validation.ValidationException;
import applica.framework.security.PasswordUtils;
import applica.framework.security.Security;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
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

    @Autowired
    private FileServer fileServer;

    @Autowired
    private MailService mailService;

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
        user.setRoles(Collections.singletonList(role));

        usersRepository.save(user);

        String activationUrl = String.format("%s/#/confirm?activationCode=%s", options.get("frontend.public.url"), user.getActivationCode());
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

        mailService.sendMail(templatedMail, Collections.singletonList(new Recipient(mail, Recipient.TYPE_TO)));
    }

    @Override
    public void confirm(String activationCode) throws MailNotFoundException {
        User user = usersRepository.find(Query.build().eq(Filters.USER_ACTIVATION_CODE, activationCode)).findFirst().orElseThrow(MailNotFoundException::new);
        user.setActive(true);

        usersRepository.save(user);
    }

    @Override
    public void recover(String mail) throws MailNotFoundException {
        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().orElseThrow(MailNotFoundException::new);

        String newPassword = PasswordUtils.generateRandom();
        Md5PasswordEncoder encoder = new Md5PasswordEncoder();
        String encodedPassword = encoder.encodePassword(newPassword, null);
        user.setPassword(encodedPassword);

        TemplatedMail templatedMail = new TemplatedMail();
        templatedMail.setOptions(options);
        templatedMail.setMailFormat(TemplatedMail.HTML);
        templatedMail.setTemplatePath("mailTemplates/recover.vm");
        templatedMail.setFrom(options.get("registration.mail.from"));
        templatedMail.setSubject(options.get("registration.mail.subject"));
        templatedMail.setTo(mail);
        templatedMail.put("password", newPassword);
        templatedMail.put("mail", mail);

        mailService.sendMail(templatedMail, Collections.singletonList(new Recipient(mail, Recipient.TYPE_TO)));    }

    @Override
    public URLData getCoverImage(Object userId, String size) throws UserNotFoundException, IOException {
        User user = usersRepository.get(userId).orElseThrow(UserNotFoundException::new);
        if (StringUtils.isNoneEmpty(user.getCoverImage())) {
            InputStream in = fileServer.getImage(user.getCoverImage(), size);
            return new URLData(String.format("image/%s", FilenameUtils.getExtension(user.getImage())), in);
        }

        return null;
    }

    @Override
    public URLData getProfileImage(Object userId, String size) throws UserNotFoundException, IOException {
        User user = usersRepository.get(userId).orElseThrow(UserNotFoundException::new);
        if (StringUtils.isNoneEmpty(user.getImage())) {
            InputStream in = fileServer.getImage(user.getImage(), size);
            return new URLData(String.format("image/%s", FilenameUtils.getExtension(user.getImage())), in);
        }

        return null;
    }

    @Override
    public void delete(Object id) throws UserNotFoundException {
        usersRepository.delete(id);
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


    @Override
    public void changePassword(String password, String passwordConfirm) throws ValidationException {
        Validation.validate(new PasswordChange(password, passwordConfirm));
        User loggedUser = (User) Security.withMe().getLoggedUser();
        ((User) loggedUser).setFirstLogin(false);
        loggedUser.setPassword(new Md5PasswordEncoder().encodePassword(password, null));
        usersRepository.save(loggedUser);
    }

}
