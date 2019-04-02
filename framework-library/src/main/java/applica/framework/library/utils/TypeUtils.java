package applica.framework.library.utils;

import applica.framework.cli.annotations.ManyToMany;
import applica.framework.cli.annotations.ManyToOne;
import applica.framework.cli.annotations.OneToMany;
import applica.framework.Entity;
import com.vividsolutions.jts.geom.*;
import org.apache.commons.beanutils.ConvertUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Stream;

public class TypeUtils {

    private static final Class<?>[] PRIMITIVE_TYPES = new Class<?>[] {
            String.class,
            Integer.class,
            Float.class,
            Double.class,
            Boolean.class,
            Byte.class,
            Short.class,
            Long.class,
            Date.class,

            //Geometry section
            Point.class,
            MultiPoint.class,
            Polygon.class,
            MultiPolygon.class,
            LineString.class,
            MultiLineString.class,
            Geometry.class
    };

    public static boolean isEntity(Class<?> type) {
        return implementsInterface(type, Entity.class, true);
    }

    public static boolean isEntity(Type type) {
        if (type instanceof Class) {
            return isEntity((Class) type);
        }

        return false;
    }

    public static boolean isList(Class<?> type) {
        return List.class.isAssignableFrom(type);
    }

    public static List<Field> getAllFields(Class<?> type) {
        List<Field> fields = new ArrayList<Field>();

        doGetAllField(type, fields, false);

        return fields;
    }

    public static List<Field> getAllFields(Class<?> type, boolean ignoreSuperClasses) {
        List<Field> fields = new ArrayList<Field>();

        doGetAllField(type, fields, ignoreSuperClasses);

        return fields;
    }

    public static boolean implementsInterface(Class<?> type, Class<?> interfaceType, boolean searchInSuperclasses) {
        boolean found = false;
        for (Class<?> item : type.getInterfaces()) {
            if (item.equals(interfaceType)) {
                found = true;
                break;
            }
        }

        if (found) {
            return true;
        } else {
            if (searchInSuperclasses && type.getSuperclass() != null) {
                return implementsInterface(type.getSuperclass(), interfaceType, searchInSuperclasses);
            }
        }

        return false;
    }

    public static void doGetAllField(Class<?> type, List<Field> fields, boolean ignoreSuperClasses) {
        for (Field newField : type.getDeclaredFields()) {
            boolean found = false;
            for (Field oldField : fields) {
                if (oldField.getName().equals(newField.getName())) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                fields.add(newField);
            }
        }

        if (type.getSuperclass() != null && !ignoreSuperClasses) {
            doGetAllField(type.getSuperclass(), fields, ignoreSuperClasses);
        }
    }

    /**
     * Check if a type's field has OneToMany or ManyToMany or ManyToOne annotation
     * @param entityType
     * @param property
     * @return
     */
    public static boolean isRelatedField(Class<? extends Entity> entityType, String property) {
        try {
            Field field = TypeUtils.getField(entityType, property);
            if (Stream.of(field.getAnnotations())
                    .filter(OneToMany.class::equals)
                    .filter(ManyToMany.class::equals)
                    .filter(ManyToOne.class::equals)
                    .count() > 0) {
                return true;
            }
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e); //programmers error
        }

        return false;
    }

    /**
     * Gets a class field, checking also from superclasses
     * @param type
     * @param name
     * @return
     * @throws NoSuchFieldException
     */
    public static Field getField(Class<?> type, String name) throws NoSuchFieldException {
        Field field = null;
        try {
            field = type.getDeclaredField(name);
        } catch (NoSuchFieldException e) {
            if (type.getSuperclass() != null) {
                field = getField(type.getSuperclass(), name);
            }
        } catch (SecurityException e) {
            e.printStackTrace();
        }
        if (field == null) throw new NoSuchFieldException();
        return field;
    }

    /**
     * Gets a class field, checking also from superclasses and nested classes
     * @param type
     * @param name You could specify a path with dots to go deep in class
     * @return
     * @throws NoSuchFieldException
     */
    public static Field getFieldRecursive(Class<?> type, String name) throws NoSuchFieldException {
        String[] paths = name.split("\\.");
        int count = paths.length;
        Class<?> currentType = type;
        Field field = null;

        for (int i = 0; i < count; i++) {
            field = getField(currentType, paths[i]);
            currentType = field.getType();
        }

        return field;
    }

    public static <T extends Annotation> T getFieldAnnotation(Class<T> annotationClass, Class<?> type, String fieldName) {
        Field field = null;
        try {
            field = getField(type, fieldName);
        } catch (NoSuchFieldException e) {
        }

        T annotation = null;
        if (field != null) {
            annotation = field.getAnnotation(annotationClass);
        }

        return annotation;
    }

    /**
     * Returns a class property generic type if is a list. For example, if a field is List<String> type, returns String.class
     * @param type
     * @param property
     * @return
     */
    public static Class<?> getListGeneric(Class<?> type, String property) {
        Class<?> genericType = null;

        try {
            Field field = TypeUtils.getField(type, property);
            ParameterizedType ptype = (ParameterizedType) field.getGenericType();
            Type[] types = ptype.getActualTypeArguments();
            if (types.length > 0) {
                Type t = types[0];
                genericType = (Class<?>) t;
            }
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }

        return genericType;
    }

    /**
     * Gets the raw class of a generic type. Es: if type is List<String> the function returns List.class
     * @param type
     * @return
     */
    public static Class<?> getRawClassFromGeneric(Type type) {
        if (type instanceof ParameterizedType) {
            return getRawClassFromGeneric(((ParameterizedType) type).getRawType());
        } else {
            return (Class<?>) type;
        }
    }

    /**
     * Returns first generic parameter type of a parameterized type. Es List<String> returns String.class
     * A parameterized type of a list usually is getted from Field.getGenericType() method.
     * @param type
     * @return
     */
    public static Class<?> getFirstGenericArgumentType(ParameterizedType type) {
        ParameterizedType listType = (ParameterizedType) type;
        Type[] arguments = listType.getActualTypeArguments();
        Class<?> typeArgument = (Class<?>) arguments[0];
        return typeArgument;
    }

    /**
     * Returns true if the specified data type is a list of Entities
     * @param dataType
     * @return
     */
    public static boolean isListOfEntities(Type dataType) {
        Class<List> listType = List.class;
        if (listType.isAssignableFrom(TypeUtils.getRawClassFromGeneric(dataType))) {
            if (dataType instanceof ParameterizedType) {
                return isEntity(getFirstGenericArgumentType((ParameterizedType) dataType));
            }
        }

        return false;
    }

    /**
     * Gets type of specified property. Property can be nested: Es: person.name
     */
    public static Class getNestedFieldType(Class type, String name) throws NoSuchFieldException {
        String[] paths = name.split("\\.");
        return doGetNestedFieldType(type, name, 0, paths);
    }

    private static Class doGetNestedFieldType(Class type, String name, int index, String[] paths) throws NoSuchFieldException {
        boolean last = index == paths.length - 1;
        if (last) {
            return TypeUtils.getField(type, paths[index]).getType();
        } else {
            return doGetNestedFieldType(TypeUtils.getField(type, paths[index]).getType(), name, index + 1, paths);
        }
    }

    public static boolean isArray(Object value) {
        return value != null && value.getClass().isArray();
    }

    public static boolean isMap(Object value) {
        return value != null && value instanceof Map;
    }

    public static boolean isList(Object value) {
        return value != null && value instanceof List;
    }

    public static boolean isPrimitive(Object value) {
        return value != null && (value.getClass().isPrimitive() || Arrays.asList(PRIMITIVE_TYPES).contains(value.getClass()));
    }

    public static <T> T cast(Object value, Class<T> destinationType, boolean useDefaultValue) {
        if (value == null) {
            if (useDefaultValue) {
                if (Double.class.equals(destinationType)) {
                    return (T) (Double) 0d;
                } else if (Float.class.equals(destinationType)) {
                    return (T) (Float) 0f;
                } else if (Long.class.equals(destinationType)) {
                    return (T) (Long) 0l;
                } else if (Integer.class.equals(destinationType)) {
                    return (T) (Integer) 0;
                } else if (Boolean.class.equals(destinationType)) {
                    return (T) (Boolean) false;
                } else {
                    try {
                        return destinationType.getConstructor().newInstance();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            } else {
                return null;
            }
        }

        return (T) ConvertUtils.convert(value, destinationType);
    }
}

