package applica._APPNAME_.services.authorizations;


import applica.framework.AEntity;
import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.security.annotations.AuthorizationContext;
import applica.framework.security.annotations.Permission;
import applica.framework.security.authorization.AuthorizationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import static applica._APPNAME_.services.authorizations.AuthorizationContexts.MACRO_CONTEXT;
import static applica._APPNAME_.services.authorizations.AuthorizationContexts.MACRO_CONTEXT_ACTION;

/**
 * Created by antoniolovicario on 23/05/17.
 */
@Component
@AuthorizationContext(MACRO_CONTEXT)
public class SampleAuthorizationContext {


    @Permission(MACRO_CONTEXT_ACTION)
    public void checkCalendar(User user) throws AuthorizationException {

    }
}
