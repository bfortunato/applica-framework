package applica._APPNAME_.services;

import applica._APPNAME_.services.exceptions.*;
import applica.framework.ValidationException;
import applica.framework.library.base64.URLData;

import java.io.IOException;

/**
 * Created by bimbobruno on 15/11/2016.
 */
public interface AccountService {

    /**
     * Register a new account. Registered account is inactive and a confirmation mail is sent
     * @param name
     * @param mail
     * @param password
     */
    void register(String name, String mail, String password) throws MailAlreadyExistsException, MailNotValidException, PasswordNotValidException, ValidationException;

    /**
     * Confirm a previously registered account
     * @param activationCode
     */
    void confirm(String activationCode) throws MailNotFoundException;

    /**
     * Removes user from system, included related entities
     * @param id
     */
    void delete(Object id) throws UserNotFoundException;

    /**
     * Recover user account by sending a new password to specified mail address, if exists
     * @param mail
     */
    void recover(String mail) throws MailNotFoundException;

    /**
     * Gets user cover image (the background image in top left of web application)
     * @param userId
     * @return
     */
    URLData getCoverImage(Object userId, String size) throws UserNotFoundException, IOException;

    /**
     * Gets user profile image (the user image in top left of web application)
     * @param userId
     * @return
     */
    URLData getProfileImage(Object userId, String size) throws UserNotFoundException, IOException;
}
