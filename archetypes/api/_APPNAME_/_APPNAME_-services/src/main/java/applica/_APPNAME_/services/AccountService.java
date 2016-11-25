package applica._APPNAME_.services;

import applica._APPNAME_.services.exceptions.*;
import applica.framework.ValidationException;

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
     * Reset lost password by mail. It sents a new password to mail address
     * @param mail
     */
    void resetPassword(String mail) throws MailNotFoundException;

    /**
     * Removes user from system, included related entities
     * @param id
     */
    void delete(Object id) throws UserNotFoundException;
}
