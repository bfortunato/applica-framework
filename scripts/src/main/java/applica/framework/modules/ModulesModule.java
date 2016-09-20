package applica.framework.modules;

import applica.framework.annotations.Action;

import java.util.Properties;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 20:22
 */
@applica.framework.annotations.Module("modules")
public class ModulesModule implements Module {

    @Action(value = "show", description = "Display all available modules")
    public void show(Properties properties) {
        Modules.instance().getModules().forEach(m -> {
            m.getMethods().forEach(me -> {
                System.out.println(
                        String.format("%s:%s\t\t%s",
                                m.getModule(),
                                me.getAction(),
                                me.getDescription())
                );
            });
        });
    }

}
