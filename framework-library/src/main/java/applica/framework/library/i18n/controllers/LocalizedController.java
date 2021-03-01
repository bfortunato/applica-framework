package applica.framework.library.i18n.controllers;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/26/13
 * Time: 4:26 PM
 */

import applica.framework.library.i18n.Localization;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

public class LocalizedController implements InitializingBean {

    @Autowired
    private WebApplicationContext context;

    protected Localization localization;

    @Override
    public void afterPropertiesSet() throws Exception {
        this.localization = new Localization(context);
    }
}