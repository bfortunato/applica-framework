package applica._APPNAME_.api.configuration;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.options.OptionsManager;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

import java.util.Objects;

/**
 * Created by antoniolovicario on 27/04/17.
 */
public class SchedulerCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return Objects.equals(ApplicationContextProvider.provide().getBean(OptionsManager.class).get("enable.scheduled.sync"), "ON");
    }

}