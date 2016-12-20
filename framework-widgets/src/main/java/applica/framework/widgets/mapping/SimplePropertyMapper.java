package applica.framework.widgets.mapping;

import applica.framework.ApplicationContextProvider;
import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SimplePropertyMapper implements PropertyMapper {

    private RepositoriesFactory repositoriesFactory;

    private Log logger = LogFactory.getLog(getClass());

    boolean isRelation(Field field) {
        if (TypeUtils.isListOfEntities(field.getType())) {
            return true;
        }

        if (TypeUtils.isEntity(field.getType())) {
            return true;
        }

        return false;
    }

    public RepositoriesFactory getRepositoriesFactory() {
        if (repositoriesFactory == null) {
            repositoriesFactory = ApplicationContextProvider.provide().getBean(RepositoriesFactory.class);
        }

        return repositoriesFactory;
    }

    public void setRepositoriesFactory(RepositoriesFactory repositoriesFactory) {
        this.repositoriesFactory = repositoriesFactory;
    }

    @Override
    public void toFormValue(String name, Map<String, Object> values, Entity entity)
            throws MappingException {

        Field field = null;
        
        try {
            field = TypeUtils.getField(entity.getClass(), name);
        } catch (Exception e) {}
        
        if (field == null) {
            throw new ProgramException(String.format("Requesting field %s of class %s but not exists", name, entity.getClass().getName()));
        }
        
        if (isRelation(field)) {
            logger.info(String.format("field %s is a related form field", name));

            try {
                Object finalValue = null;
                Class<List> listType = List.class;
                if (listType.isAssignableFrom(TypeUtils.getRawClassFromGeneric(field.getType()))) {
                    logger.info(String.format("related field %s is list of entity type", name));

                    List list = (List) PropertyUtils.getProperty(entity, name);
                    finalValue = list;
                } else {
                    logger.info(String.format("related field %s is single entity type", name));

                    Entity relatedEntity = (Entity) PropertyUtils.getProperty(entity, name);
                    finalValue = relatedEntity;
                }
                values.put(name, finalValue);
            } catch (Exception e) {
                throw new MappingException(name, e);
            }
        } else {
            logger.info(String.format("field %s is standard field", name));
            Object value = null;
            try {
                value = PropertyUtils.getProperty(entity, name);
            } catch (Exception e) {
                throw new MappingException(name, e);
            }

            values.put(name, value);
        }
    }

    @Override
    public void toEntityProperty(String name, Entity entity, Map<String, String[]> requestValues) throws MappingException {

        Field field = null;
        try {
            field = TypeUtils.getField(entity.getClass(), name);
        } catch (Exception e) {}

        if (field == null) {
            throw new ProgramException(String.format("Requesting field %s of class %s but not exists", name, entity.getClass().getName()));
        }

        if (requestValues.containsKey(name)) {
            String[] requestValueArray = requestValues.get(name);
            Object finalValue = null;

            if (isRelation(field)) {
                logger.info(String.format("field %s is a related form field", name));

                Repository repository = null;

                Class<List> listType = List.class;
                if (listType.isAssignableFrom(TypeUtils.getRawClassFromGeneric(field.getType()))) {
                    Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
                    if (repository == null) {
                        repository = getRepositoriesFactory().createForEntity((Class<? extends Entity>) typeArgument);
                    }

                    logger.info(String.format("related field %s is list of entity type", name));

                    List entities = null;
                    try {
                        entities = ((List) PropertyUtils.getProperty(entity, name));
                        if (entities != null) {
                            entities.clear();
                        } else {
                            entities = new ArrayList();
                        }
                    } catch (Exception e) {}
                    for (String id : requestValueArray) {
                        repository.get(id).ifPresent(entities::add);
                    }

                    finalValue = entities;
                } else {
                    logger.info(String.format("related field %s is single entity type", name));

                    if (repository == null) {
                        repository = getRepositoriesFactory().createForEntity((Class<? extends Entity>) field.getType());
                    }

                    String relatedId = requestValueArray[0];
                    Entity relatedEntity = null;
                    if (StringUtils.hasLength(relatedId)) {
                        relatedEntity = (Entity) repository.get(relatedId).orElseGet(() -> null);
                    }

                    finalValue = relatedEntity;
                }

                try {
                    BeanUtils.setProperty(entity, name, finalValue);
                } catch (Exception e) {
                    throw new MappingException(name, e);
                }
            } else {
                logger.info(String.format("field %s is a standard type", name));

                if (List.class.isAssignableFrom(TypeUtils.getRawClassFromGeneric(field.getType()))) {
                    Class<?> genericType = TypeUtils.getListGeneric(entity.getClass(), name);
                    if (genericType == null)
                        throw new RuntimeException("Trying to mapping a list without generic type");
                    List list = new ArrayList();
                    for (int i = 0; i < requestValueArray.length; i++) {
                        list.add(ConvertUtils.convert(requestValueArray[i], genericType));
                    }

                    finalValue = list;
                } else {
                    finalValue = requestValueArray;
                }

                try {
                    BeanUtils.setProperty(entity, name, finalValue);
                } catch (Exception e) {
                    throw new MappingException(name, e);
                }


            }
        } else {
            //if value is a list and nothing comes from request, the list must be cleared
            Object finalValue = null;

            if (List.class.isAssignableFrom(TypeUtils.getRawClassFromGeneric(field.getType()))) {
                List entities = null;
                try {
                    entities = ((List) PropertyUtils.getProperty(entity, name));
                    if (entities != null) {
                        entities.clear();
                    }
                } catch (Exception e) {}

                finalValue = entities;

                try {
                    BeanUtils.setProperty(entity, name, finalValue);
                } catch (Exception e) {
                    throw new MappingException(name, e);
                }
            }
        }
    }


}
