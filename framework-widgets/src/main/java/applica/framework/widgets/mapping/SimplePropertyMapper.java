package applica.framework.widgets.mapping;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.utils.TypeUtils;
import applica.framework.widgets.FormDescriptor;
import applica.framework.widgets.FormField;
import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;

import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SimplePropertyMapper implements PropertyMapper {

    private RepositoriesFactory repositoriesFactory;

    private Log logger = LogFactory.getLog(getClass());

    boolean isRelation(FormField formField) {
        if (TypeUtils.isListOfEntities(formField.getDataType())) {
            return true;
        }

        if (TypeUtils.isEntity(formField.getDataType())) {
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

    @SuppressWarnings({"rawtypes"})
    @Override
    public void toFormValue(FormDescriptor formDescriptor, FormField formField, Map<String, Object> values, Entity entity)
            throws MappingException {

        if (isRelation(formField)) {
            logger.info(String.format("field %s is a related form field", formField.getProperty()));

            try {
                Object finalValue = null;
                Class<List> listType = List.class;
                if (listType.isAssignableFrom(TypeUtils.getRawClassFromGeneric(formField.getDataType()))) {
                    logger.info(String.format("related field %s is list of entity type", formField.getProperty()));

                    List list = (List) PropertyUtils.getProperty(entity, formField.getProperty());
                    finalValue = list;
                } else {
                    logger.info(String.format("related field %s is single entity type", formField.getProperty()));

                    Entity relatedEntity = (Entity) PropertyUtils.getProperty(entity, formField.getProperty());
                    finalValue = relatedEntity;
                }
                values.put(formField.getProperty(), finalValue);
            } catch (Exception e) {
                throw new MappingException(formField.getProperty(), e);
            }
        } else {
            logger.info(String.format("field %s is standard field", formField.getProperty()));
            Object value = null;
            try {
                value = PropertyUtils.getProperty(entity, formField.getProperty());
            } catch (Exception e) {
                throw new MappingException(formField.getProperty(), e);
            }

            values.put(formField.getProperty(), value);
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public void toEntityProperty(FormDescriptor formDescriptor, FormField formField, Entity entity, Map<String, String[]> requestValues)
            throws MappingException {
        if (requestValues.containsKey(formField.getProperty())) {
            String[] requestValueArray = requestValues.get(formField.getProperty());
            Object finalValue = null;

            if (isRelation(formField)) {
                logger.info(String.format("field %s is a related form field", formField.getProperty()));

                Repository repository = null;

                Class<List> listType = List.class;
                if (listType.isAssignableFrom(TypeUtils.getRawClassFromGeneric(formField.getDataType()))) {
                    Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) formField.getDataType());
                    if (repository == null) {
                        repository = getRepositoriesFactory().createForEntity((Class<? extends Entity>) typeArgument);
                    }

                    logger.info(String.format("related field %s is list of entity type", formField.getProperty()));

                    List entities = null;
                    try {
                        entities = ((List) PropertyUtils.getProperty(entity, formField.getProperty()));
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
                    logger.info(String.format("related field %s is single entity type", formField.getProperty()));

                    if (repository == null) {
                        repository = getRepositoriesFactory().createForEntity((Class<? extends Entity>) formField.getDataType());
                    }

                    String relatedId = requestValueArray[0];
                    Entity relatedEntity = null;
                    if (StringUtils.hasLength(relatedId)) {
                        relatedEntity = (Entity) repository.get(relatedId).orElseGet(() -> null);
                    }

                    finalValue = relatedEntity;
                }

                try {
                    BeanUtils.setProperty(entity, formField.getProperty(), finalValue);
                } catch (Exception e) {
                    throw new MappingException(formField.getProperty(), e);
                }
            } else {
                logger.info(String.format("field %s is a standard type", formField.getProperty()));

                if (List.class.isAssignableFrom(TypeUtils.getRawClassFromGeneric(formField.getDataType()))) {
                    Class<?> genericType = TypeUtils.getListGeneric(entity.getClass(), formField.getProperty());
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
                    BeanUtils.setProperty(entity, formField.getProperty(), finalValue);
                } catch (Exception e) {
                    throw new MappingException(formField.getProperty(), e);
                }


            }
        } else {
            //if value is a list and nothing comes from request, the list must be cleared
            Object finalValue = null;

            if (List.class.isAssignableFrom(TypeUtils.getRawClassFromGeneric(formField.getDataType()))) {
                List entities = null;
                try {
                    entities = ((List) PropertyUtils.getProperty(entity, formField.getProperty()));
                    if (entities != null) {
                        entities.clear();
                    }
                } catch (Exception e) {}

                finalValue = entities;

                try {
                    BeanUtils.setProperty(entity, formField.getProperty(), finalValue);
                } catch (Exception e) {
                    throw new MappingException(formField.getProperty(), e);
                }
            }
        }
    }


}
