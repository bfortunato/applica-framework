package applica._APPNAME_.domain.validation;

import applica._APPNAME_.domain.model.Role;
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
public class RoleValidator implements Validator {
    
    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(Role.class);
    }

    @Override
    public void validate(Object o, Errors errors) {
        if(!StringUtils.hasLength(((Role) o).getRole())) { errors.rejectValue("role", null, "validation.role.role"); }
    }
}
