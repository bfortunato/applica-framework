package applica._APPNAME_.frontend.validation;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.User;
import applica.framework.LoadRequest;
import applica.framework.library.mail.MailUtils;
import applica.framework.library.options.OptionsManager;
import applica._APPNAME_.frontend.viewmodel.UIRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 29/10/13
 * Time: 10:59
 */

@Component
public class UIRegistrationValidator implements Validator {

    @Autowired
    private OptionsManager options;

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public void validate(Object o, Errors errors) {
        UIRegistration registration = (UIRegistration)o;
        int minPasswordLength = Integer.parseInt(options.get("security.password.length"));

        if(!MailUtils.isValid(registration.getMail())) { errors.rejectValue("mail", null, "validation.registration.mail"); }
        if(!MailUtils.isValid(registration.getMailConfirm())) { errors.rejectValue("mail", null, "validation.registration.mail.confirm"); }
        if(registration.getMailConfirm() == null || !registration.getMailConfirm().equals(registration.getMailConfirm())) { errors.rejectValue("mail", null, "validation.registration.mailConfirm"); }
        if(!StringUtils.hasLength(registration.getPassword()) || registration.getPassword().length() < 6) { errors.rejectValue("password", null, "validation.registration.password"); }
        
        if(StringUtils.hasLength(registration.getMail())) {
            usersRepository
                    .find(LoadRequest.build().filter(Filters.USER_MAIL, registration.getMail()))
                    .findFirst()
                    .ifPresent(other -> errors.rejectValue("mail", null, "validation.registration.mail.exists"));

        }
    }    
    
}
