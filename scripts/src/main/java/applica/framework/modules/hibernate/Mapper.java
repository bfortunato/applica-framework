package applica.framework.modules.hibernate;

import applica.framework.Key;
import applica.framework.annotations.ManyToMany;
import applica.framework.library.utils.ClassHierarchy;
import applica.framework.library.utils.Strings;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.Date;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 13:19
 */
public class Mapper extends XmlBuilder {

    private ClassHierarchy hierarchy;

    private static final Class<?>[] ALLOWED_TYPES = new Class<?>[] {
            String.class,
            Integer.class,
            Float.class,
            Double.class,
            Boolean.class,
            Byte.class,
            Short.class,
            Long.class,
            Date.class
    };

    public Mapper(ClassHierarchy hierarchy) {
        this.hierarchy = hierarchy;
    }

    private static boolean isAllowed(Class<?> type) {
        if (type.isPrimitive()) return true;

        for(Class<?> allowedType : ALLOWED_TYPES) {
            if (type.equals(allowedType)) return true;
        }

        return false;
    }

    public String map() {
        Class type = hierarchy.getSuperType();
        boolean subclass = hierarchy.getParent() != null;

        if (!subclass) {
            raw("<?xml version=\"1.0\" encoding=\"utf-8\"?>"); endl();
            raw("<!DOCTYPE hibernate-mapping PUBLIC \"-//Hibernate/Hibernate Mapping DTD//EN\" \"http://www.hibernate.org/dtd/hibernate-mapping-3.0.dtd\">"); endl();
            open("hibernate-mapping"); endl();
        }

        open(subclass ? "subclass" : "class",
                attr("name", type.getName()),
                (subclass || hierarchy.getSubTypes().size() > 0) ? attr("discriminator-value", type.getName()) : null,
                subclass ? null : attr("table", Strings.pluralize(StringUtils.uncapitalize(type.getSimpleName())))
        ); endl();

        if (!subclass) {
            open("id", attr("name", "id"), attr("type", "long")); endl();
                openClose("generator", attr("class", "native")); endl();
            close("id"); endl();
        }

        if (hierarchy.getSubTypes().size() > 0 && !subclass) {
            endl();
            raw("<discriminator column=\"class\" type=\"string\" />"); endl();
            endl();
        }

        TypeUtils.getAllFields(type, subclass)
                .stream()
                .filter(t -> !Modifier.isTransient(t.getModifiers()))
                .filter(t -> !Modifier.isStatic(t.getModifiers()))
                .filter(t -> !t.getName().equals("id"))
                .filter(t ->
                                Mapper.isAllowed(t.getType()) ||
                                        TypeUtils.isList(t.getType()) ||
                                        TypeUtils.isEntity(t.getType()) ||
                                        Key.class.equals(t.getType()) ||
                                        Mapper.isForeignKeyId(t)
                )
                .forEach(field -> {
                    if (TypeUtils.isEntity(field.getType())) {
                        String foreignKeyName = String.format("%sId", field.getName());
                        openClose("many-to-one",
                                attr("name", field.getName()),
                                attr("class", field.getType().getName()),
                                attr("column", foreignKeyName),
                                attr("lazy", "false")
                        );
                        endl();
                    } else if (TypeUtils.isList(field.getType())) {
                        boolean isManyToMany = field.getAnnotation(ManyToMany.class) != null;
                        Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType(((ParameterizedType) field.getGenericType()));

                        String tableName;
                        if (isManyToMany) {
                            tableName = String.format("%s_%s", StringUtils.uncapitalize(Strings.pluralize(type.getSimpleName())), Strings.pluralize(StringUtils.uncapitalize(typeArgument.getSimpleName())));
                        } else {
                            tableName = Strings.pluralize(StringUtils.uncapitalize(typeArgument.getSimpleName()));
                        }

                        if (TypeUtils.isEntity(typeArgument)) {
                            open("list",
                                    attr("name", field.getName()),
                                    attr("table", tableName),
                                    attr("lazy", "false"),
                                    !isManyToMany ? attr("cascade", "all-delete-orphan") : null
                            );
                            endl();
                            String foreignKeyName = String.format("%sId", StringUtils.uncapitalize(type.getSimpleName()));
                            String foreignKeyName2 = String.format("%sId", StringUtils.uncapitalize(typeArgument.getSimpleName()));
                            openClose("key", attr("column", foreignKeyName));
                            endl();
                            openClose("list-index", attr("column", "idx"));
                            endl();
                            if (isManyToMany) {
                                openClose("many-to-many", attr("class", typeArgument.getName()), attr("column", foreignKeyName2));
                                endl();
                            } else {
                                openClose("one-to-many", attr("class", typeArgument.getName()));
                                endl();
                            }
                            close("list");
                            endl();
                        } else if (Mapper.isAllowed(typeArgument)) {
                            open("list",
                                    attr("name", field.getName()),
                                    attr("table", field.getName()),
                                    attr("lazy", "false")
                            );
                            endl();
                            String foreignKeyName = String.format("%sId", StringUtils.uncapitalize(type.getSimpleName()));
                            openClose("key", attr("column", foreignKeyName));
                            endl();
                            openClose("list-index", attr("column", "idx"));
                            endl();
                            openClose("element", attr("column", "value"), attr("type", typeArgument.getName()));
                            endl();
                            close("list");
                            endl();
                        }
                    } else if (Key.class.equals(field.getType())) {
                        open("component", attr("name", field.getName()), attr("class", field.getType().getName()));
                        endl();
                        openClose("property", attr("name", "value"), attr("type", "long"), attr("column", field.getName()));
                        endl();
                        close("component");
                        endl();
                    } else if (Mapper.isForeignKeyId(field)) {
                        openClose("property", attr("name", field.getName()), attr("type", "long"));
                        endl();
                    } else {
                        openClose("property", attr("name", field.getName()));
                        endl();
                    }
                });


        for (ClassHierarchy subType : hierarchy.getSubTypes()) {
            endl();
            Mapper mapper = new Mapper(subType);
            mapper.setBaseLevel(level + baseLevel);
            rawNoIndent(mapper.map());
        }

        close(subclass ? "subclass" : "class"); endl();

        if (!subclass) {
            close("hibernate-mapping"); endl();
        }
        return xml.toString();
    }

    private static boolean isForeignKeyId(Field field) {
        return field.getName().endsWith("Id");
    }

}
