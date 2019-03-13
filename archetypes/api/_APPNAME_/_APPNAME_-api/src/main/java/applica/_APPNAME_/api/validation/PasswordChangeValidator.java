package applica._APPNAME_.api.validation;


import applica._APPNAME_.domain.model.PasswordChange;
import applica._APPNAME_.services.AccountService;
import applica.framework.Entity;
import applica.framework.library.validation.ValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by antoniolovicario on 05/10/15.
 */
@Component
public class PasswordChangeValidator implements applica.framework.library.validation.Validator  {

    @Autowired
    private AccountService accountService;

    public static final String PATTERN = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}";

    @Override
    public void validate(Entity entity, ValidationResult validationResult) {
        PasswordChange passwordChange = (PasswordChange) entity;
        if (!StringUtils.hasLength(passwordChange.getPassword())) {
            validationResult.reject("password", "validation.field.required");
        } else {

            if (!isValid(passwordChange.getPassword())) {
                validationResult.reject("password", "validation.password.pattern");

            }

            //l'utente non può inserire la stessa password che già possiede
            if (passwordChange.getUser().getPassword().equals(accountService.encryptAndGetPassword(passwordChange.getPassword()))) {
                validationResult.reject("password", "validation.password.different");
            }
        }
        if (!StringUtils.hasLength(passwordChange.getPasswordConfirm())) {
            validationResult.reject("passwordConfirm", "validation.field.required");
        }
        if (!passwordChange.getPassword().equals(passwordChange.getPasswordConfirm())) {
            validationResult.reject("passwordConfirm", "validation.user.password_confirm");
        }

        //Verifico che la password non sia uguale a nessuna delle eventuali tre password precedenti
        if (validationResult.isValid()) {
            if (accountService.hasPasswordSetBefore(passwordChange.getUser().getSid(), accountService.encryptAndGetPassword(passwordChange.getPassword()), 3)) {
                validationResult.reject("passwordConfirm", "validation.user.password.settedBefore");
            }
        }
    }

    private boolean isValid(String password) {
        Pattern p = Pattern.compile(PATTERN);
        Matcher m = p.matcher(password);
        return m.matches();
    }

    @Override
    public Class getEntityType() {
        return PasswordChange.class;
    }
}


