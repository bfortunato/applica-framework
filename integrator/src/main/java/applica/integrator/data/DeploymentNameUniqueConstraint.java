package applica.integrator.data;

import applica.framework.Query;
import applica.framework.data.mongodb.constraints.UniqueConstraint;
import applica.integrator.model.Deployment;
import applica.integrator.model.Filters;
import org.springframework.stereotype.Component;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 18:18
 */
@Component
public class DeploymentNameUniqueConstraint extends UniqueConstraint<Deployment> {

    @Override
    public Class<Deployment> getType() {
        return Deployment.class;
    }

    @Override
    public String getProperty() {
        return "name";
    }

    @Override
    protected Query getOptimizedQuery(Deployment entity) {
        return Query.build().eq(Filters.DEPLOYMENT_NAME, entity.getName());
    }
}
