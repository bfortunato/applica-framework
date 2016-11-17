package applica.framework.library.velocity;

import applica.framework.library.utils.ProgramException;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/22/13
 * Time: 9:00 AM
 */
public class VelocityBuilderProvider {

    private static VelocityBuilder velocityBuilder;

    @Autowired
    protected void setVelocityBuilder(VelocityBuilder velocityBuilder) {
        VelocityBuilderProvider.velocityBuilder = velocityBuilder;
    }

    public static VelocityBuilder provide() {
        if (velocityBuilder == null) {
            throw new ProgramException("Please configure velocity builder in Spring Application Context");
        }
        return velocityBuilder;
    }

}
