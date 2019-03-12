package applica._APPNAME_.domain.validation;


import applica._APPNAME_.domain.model.PasswordChange;
import applica.framework.Entity;
import applica.framework.library.validation.ValidationResult;
import applica.framework.security.Security;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Created by antoniolovicario on 05/10/15.
 */
@Component
public class PasswordChangeValidator implements applica.framework.library.validation.Validator  {

    @Override
    public void validate(Entity entity, ValidationResult validationResult) {
        PasswordChange passwordChange = (PasswordChange) entity;
        if (!StringUtils.hasLength(passwordChange.getPassword())) {
            validationResult.reject("password", "Password obbligatoria");
        } else {
            //l'utente non può inserire la stessa password che già possiede
            PasswordEncoder encoder = new PasswordEncoder() {
                @Override
                public String encode(CharSequence charSequence) {
                    return null;
                }

                @Override
                public boolean matches(CharSequence charSequence, String s) {
                    return false;
                }
            }
            String md5Secret = PasswordEncoder.encodePassword(passwordChange.getPassword(), null);
            if (Security.withMe().getLoggedUser().getPassword().equals(md5Secret)) {
                validationResult.reject("password", "Inserire una password diversa dalla precedente");
            }
        }
        if (!StringUtils.hasLength(passwordChange.getPasswordConfirm())) {
            validationResult.reject("passwordConfirm", "Conferma password obbligatoria");
        }
        if (!passwordChange.getPassword().equals(passwordChange.getPasswordConfirm())) {
            validationResult.reject("passwordConfirm", "La password non coincide con la sua conferma");
        }
    }

    @Override
    public Class getEntityType() {
        return PasswordChange.class;
    }
}


