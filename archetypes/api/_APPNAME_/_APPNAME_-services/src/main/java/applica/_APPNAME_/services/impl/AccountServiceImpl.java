package applica._APPNAME_.services.impl;

import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.*;
import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.MailService;
import applica._APPNAME_.services.exceptions.*;
import applica._APPNAME_.domain.data.UsersRepository;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import applica.framework.library.mail.MailUtils;
import applica.framework.library.mail.Recipient;
import applica.framework.library.mail.TemplatedMail;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.validation.Validation;
import applica.framework.library.validation.ValidationException;
import applica.framework.security.PasswordUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private UserService userService;

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
        String encodedPassword = encryptAndGetPassword(password);

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
        String encodedPassword = encryptAndGetPassword(newPassword);
        user.setPassword(encodedPassword);

        usersRepository.save(user);

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
    public void changePassword(User user, String password, String passwordConfirm) throws ValidationException, MailNotFoundException {
        if (user == null)
            throw new MailNotFoundException();
        Validation.validate(new PasswordChange(user, password, passwordConfirm));

        //Salvo la vecchia password (criptata) nello storico di quelle modificate dall'utente
        String previousPassword = user.getPassword();

        user.setCurrentPasswordSetDate(new Date());
        user.setPassword(encryptAndGetPassword(password));
        usersRepository.save(user);

        new Thread(()-> {
            Repo.of(UserPassword.class).save(new UserPassword(previousPassword, user.getSid()));
        }).start();
    }

    @Override
    public String encryptAndGetPassword(String password) {
        password = password + "{" + options.get("password.salt") + "}";

        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] array = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte anArray : array) {
                sb.append(Integer.toHexString((anArray & 0xFF) | 0x100), 1, 3);
            }

            return sb.toString();

        } catch (java.security.NoSuchAlgorithmException ignored) {

        }
        return "";
    }

    @Override
    public boolean needToChangePassword(applica.framework.security.User user) {
        Calendar threeMonthAgo = Calendar.getInstance();
        threeMonthAgo.add(Calendar.MONTH, -1 * getPasswordDuration());
        return ((User) user).getCurrentPasswordSetDate() == null || ((User) user).getCurrentPasswordSetDate().before(threeMonthAgo.getTime());
    }

    @Override
    public void deactivateInactiveUsers() {
        Calendar sixMonthAgo = Calendar.getInstance();
        //TODO: parametrizzare questo valore?
        sixMonthAgo.add(Calendar.MONTH, -6);
        Repo.of(User.class).find(Query.build().lte(Filters.LAST_LOGIN, sixMonthAgo.getTime())).getRows().forEach(u -> {
            u.setActive(false);
            Repo.of(User.class).save(u);
        });
    }


    private int getPasswordDuration() {
        return Integer.parseInt(options.get("password.duration"));
    }

    @Override
    public boolean hasPasswordSetBefore(Object userId, String encryptedPassword, Integer changesToConsider) {
        Query query = Query.build().eq(Filters.USER_ID, userId).sort(Filters.CREATION_DATE, true);
        if (changesToConsider != null) {
            query.setPage(1);
            query.setRowsPerPage(changesToConsider);
        }

        return Repo.of(UserPassword.class).find(query).getRows().stream().filter(p -> Objects.equals(encryptedPassword, p.getPassword())).collect(Collectors.toList()).size() > 0;
    }
    @Override
    public PasswordRecoveryCode getPasswordRecoverForUser(String userId) {
        return Repo.of(PasswordRecoveryCode.class).find(Query.build().eq(Filters.USER_ID, userId)).findFirst().orElse(null);
    }

    @Override
    public PasswordRecoveryCode getPasswordRecoveryCode(String code) {
        return Repo.of(PasswordRecoveryCode.class).find(Query.build().eq(Filters.CODE, code)).findFirst().orElse(null);
    }

    @Override
    public void deletePasswordRecoveryCode(PasswordRecoveryCode code) {
        Repo.of(PasswordRecoveryCode.class).delete(code.getSid());
    }

    @Override
    public void savePasswordRecoveryCode(PasswordRecoveryCode passwordRecoveryCode) {
        Repo.of(PasswordRecoveryCode.class).save(passwordRecoveryCode);
    }

    @Override
    public void validateRecoveryCode(String mail, String code, boolean deleteRecord) throws MailNotFoundException, CodeNotValidException {
        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().orElseThrow(MailNotFoundException::new);
        PasswordRecoveryCode passwordRecoveryCode = Repo.of(PasswordRecoveryCode.class).find(Query.build().eq(Filters.USER_ID, user.getSid()).eq(Filters.CODE, code.toUpperCase())).findFirst().orElseThrow(CodeNotValidException::new);
        if (deleteRecord)
            Repo.of(PasswordRecoveryCode.class).delete(passwordRecoveryCode.getId());
    }

    @Override
    public void resetPassword(String mail, String code, String password, String passwordConfirm) throws MailNotFoundException, CodeNotValidException, ValidationException {
        validateRecoveryCode(mail, code, false);
        User user = userService.getUserByMails(Arrays.asList(mail)).get(0);
        changePassword(user, password, passwordConfirm);
        PasswordRecoveryCode passwordRecoveryCode = getPasswordRecoveryCode(code);
        deletePasswordRecoveryCode(passwordRecoveryCode);
    }

}
