package applica._APPNAME_.domain.validation;

import applica._APPNAME_.domain.model.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 05/11/13
 * Time: 18:26
 */
@Component
public class UserValidator implements Validator {

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(User.class);
    }

    @Override
    public void validate(Object o, Errors errors) {
        if(!StringUtils.hasLength(((User) o).getMail())) { errors.rejectValue("mail", null, "validation.user.mail"); }
        //if(!StringUtils.hasLength(((User) o).getPassword())) { errors.rejectValue("password", null, "validation.user.password"); }
    }
}
