package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.annotations.ManyToMany;
import applica.framework.annotations.ManyToOne;
import applica.framework.annotations.OneToMany;
import applica.framework.data.IgnoreNestedReferences;
import applica.framework.library.utils.TypeUtils;
import com.mongodb.BasicDBObject;
import com.mongodb.client.model.geojson.Geometry;
import org.apache.commons.logging.Log;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class MongoMapper {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

	private static Log logger = org.apache.commons.logging.LogFactory.getLog(MongoMapper.class);
	
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

	public BasicDBObject loadBasicDBObject(Persistable source, MappingContext mappingContext) {
		if (mappingContext == null) {
			mappingContext = new MappingContext();
		}

		BasicDBObject document = new BasicDBObject();
		if (source != null && document != null) {			
			Class<?> type = source.getClass();
            
            //put entity id in document
			if (source instanceof Entity) {
				Entity psource = (Entity) source;
				if (psource.getId() != null) {
					try {
						document.put("_id", new ObjectId(String.valueOf(psource.getId())));
					} catch (Exception e) {
						//logger.warn(String.format("invalid id for entity %s: %s", type.getName(), source.getId()));
					}
				}
			}
            
			//logger.warn("Converting " + type.getSimpleName());
			for(Field field : TypeUtils.getAllFields(type)) {
				if (!Modifier.isTransient(field.getModifiers()) && !Modifier.isStatic(field.getModifiers())) {
					//logger.warn(" --- field: " + field.getName());
					field.setAccessible(true);
									
					if (field.getName().equals("id")) {
						continue;
					} else {
                        try {
							if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
								mappingContext.pushIgnoreNestedReferences();
							}

                            if (!mappingContext.isIgnoringNestedReferences() && (field.getAnnotation(ManyToMany.class) != null || field.getAnnotation(OneToMany.class) != null)) {
                                Object fieldSourceValue = field.get(source);
                                if (fieldSourceValue != null && TypeUtils.isList(fieldSourceValue.getClass())) {
                                    List<?> sourceList = (List<?>) fieldSourceValue;
                                    ArrayList<Object> values = new ArrayList<Object>();
                                    Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
                                    Assert.isTrue(TypeUtils.isEntity(typeArgument), "ManyToMany not allowed for non-entity types: " + field.getName());
                                    for (Object el : sourceList) {
                                        Entity e = (Entity) el;
                                        values.add(e.getId());
                                    }
                                    document.put(field.getName(), values);
                                }
                            } else if (!mappingContext.isIgnoringNestedReferences() && field.getAnnotation(ManyToOne.class) != null) {
                                Object fieldSourceValue = field.get(source);
                                if (fieldSourceValue != null && TypeUtils.isEntity(fieldSourceValue.getClass())) {
                                    Entity fieldSourceEntity = ((Entity) fieldSourceValue);
                                    String value = SEntity.checkedId(fieldSourceEntity.getId());
                                    if (StringUtils.hasLength(value)) {
                                        document.put(field.getName(), value);
                                    }
                                }
                            } else {
                                Object fieldSourceValue = field.get(source);
                                if (fieldSourceValue != null) {
                                    Object basicDBObjectValue = convertToBasicDBObjectValue(fieldSourceValue, mappingContext);
                                    if (basicDBObjectValue != null) {
                                        document.put(field.getName(), basicDBObjectValue);
                                    }
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        } finally {
                        	if (field != null) {
								if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
									mappingContext.popIgnoreNestedReferences();
								}
							}
						}
					}
				}
			}
		} 
		
		return document;
	}
	
	
	
	private Object convertToBasicDBObjectValue(Object source, MappingContext mappingContext) {
		Object value = null;
		if (TypeUtils.isPersistable(source.getClass())) {
			try {
				//logger.warn("Field is entity");
				value = loadBasicDBObject((Persistable) source, mappingContext);
			} catch (Exception e) {
				e.printStackTrace();
			}	
		} else if (source.getClass().equals(Key.class)) {
            value = ((Key) source).getValue();
        } else if (isAllowed(source.getClass())) {	
            value = source;	
		} else if (TypeUtils.isList(source.getClass())) {
			try {
				List<?> list = (List<?>) source;
				ArrayList<Object> values = new ArrayList<Object>();
				for (Object el : list) {
					Object elVal = convertToBasicDBObjectValue(el, mappingContext);
					if (elVal != null) values.add(elVal);
				}
				value = values;
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if (isGeometry(source.getClass()))
			value = source;
		
		return value;
	}

	private boolean isGeometry(Class<?> aClass) {
		return Geometry.class.isAssignableFrom(aClass);
	}

	public Object loadObject(BasicDBObject source, Class<?> destinationType, MappingContext mappingContext) {
		if (mappingContext == null) {
			mappingContext = new MappingContext();
		}

		Persistable destination;
		try {
			destination = (Persistable)destinationType.getConstructor().newInstance();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		if (source != null) {
			Class<?> type = destination.getClass();
			for(String key : source.keySet()) {
				if (key.equals("_id")) {
					if (destination instanceof Entity) {
						((Entity) destination).setId(source.getString(key));
					}
				} else {
					Field field = null;

					try {
						field = TypeUtils.getField(type, key);

						if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
							mappingContext.pushIgnoreNestedReferences();
						}

						if (!Modifier.isTransient(field.getModifiers()) && !Modifier.isStatic(field.getModifiers())) {
							field.setAccessible(true);

							if (key.endsWith("Id") && field.getType().equals(Object.class)) {
								field.set(destination, source.get(field.getName()));
							} else if (TypeUtils.isPersistable(field.getType())) {
								if ((!mappingContext.isIgnoringNestedReferences() && isId(source, field)) && field.getAnnotation(ManyToOne.class) != null) {
                                    Entity value = null;
                                    String sourceId = (String) source.get(field.getName());
									value = mappingContext.getCached((Class<? extends Entity>) field.getType(), sourceId);
									if (value == null) {
										Repository repository = repositoriesFactory.createForEntity((Class<? extends Entity>) field.getType());
										Objects.requireNonNull(repository, "Repository for class not found: " + field.getType().toString());
										if (repository instanceof MongoRepository) {
											value = (Entity) ((MongoRepository) repository).get(sourceId, mappingContext).orElse(null);
										} else{
											value = (Entity) repository.get(sourceId).orElse(null);
										}
										mappingContext.putInCache(value);
									}
                                    if (value != null) {
                                        field.set(destination, value);
                                    }
                                } else {
                                    BasicDBObject childDocument = (BasicDBObject)source.get(key);
                                    Object value = loadObject(childDocument, field.getType(), mappingContext);
                                    field.set(destination, value);
                                }
                            }
							else if (Geometry.class.isAssignableFrom(field.getType())) {

								field.set(destination, source.get(field.getName()));
							}

							else if (field.getType().equals(Key.class)) {
                                field.set(destination, new Key(source.get(key)));
                            } else if (isAllowed(field.getType())) {
								field.set(destination, source.get(key));
							} else if (TypeUtils.isList(field.getType())) {
                                if ((!mappingContext.isIgnoringNestedReferences() && firstIsId(source, field)) && (field.getAnnotation(ManyToMany.class) != null || field.getAnnotation(OneToMany.class) != null)) {
                                    ArrayList<Object> values = new ArrayList<Object>();
                                    Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
                                    Assert.isTrue(TypeUtils.isEntity(typeArgument), "ManyToMany not allowed for non-entity types: " + field.getName());
                                    List<?> sourceList = (List<?>)source.get(field.getName());
                                    Repository repository = repositoriesFactory.createForEntity((Class<? extends Entity>) typeArgument);
                                    Objects.requireNonNull(repository, "Repository for class not found: " + typeArgument.toString());
                                    for(Object el : sourceList) {
										Entity value = mappingContext.getCached((Class<? extends Entity>) typeArgument, el);
										if (value == null) {
											if (repository instanceof MongoRepository) {
												value = (Entity) ((MongoRepository) repository).get(el, mappingContext).orElse(null);
											} else{
												value = (Entity) repository.get(el).orElse(null);
											}
											mappingContext.putInCache(value);
										}

										if (value != null) {
											values.add(value);
										}
                                    }
                                    field.set(destination, values);
                                } else {
                                    ArrayList<Object> values = new ArrayList<Object>();
                                    Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
                                    List<?> sourceList = (List<?>)source.get(field.getName());
                                    for(Object el : sourceList) {
                                        if (TypeUtils.isPersistable(typeArgument)) {
                                            values.add(loadObject((BasicDBObject)el, typeArgument, mappingContext));
                                        } else if (isAllowed(typeArgument)) {
                                            values.add(el);
                                        } else if (Object.class.equals(typeArgument)) {
                                        	values.add(el);
										}
                                    }
                                    field.set(destination, values);
                                }
							} else if (Objects.equals(field.getType(), Object.class)) {
								field.set(destination, source.get(key));
							}
												
						}
					} catch(NoSuchFieldException e) {
						logger.warn("Field in database " + key + " isn't available on class");
					} catch (Exception e) {	
						logger.warn("Error in field " + key);
						e.printStackTrace();
					} finally {
						if (field != null) {
							if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
								mappingContext.popIgnoreNestedReferences();
							}
						}
					}
				}
			}
		}
		
		return destination;
	}

	private boolean firstIsId(BasicDBObject source, Field field) {
		if (source == null) {
			return false;
		}

		List<?> sourceList = (List<?>)source.get(field.getName());
		if (sourceList != null && sourceList.size() > 0) {
			Object value = sourceList.get(0);
			if (value != null) {
				return String.class.equals(value.getClass());
			}
		}

		return false;
	}

	private boolean isId(BasicDBObject source, Field field) {
		if (source == null) {
			return false;
		}
		Object value = source.get(field.getName());
		if (value != null) {
			return String.class.equals(value.getClass());
		}

		return false;
	}

	private static boolean isAllowed(Class<?> type) {
		if (type.isPrimitive()) return true;
		
		for(Class<?> allowedType : ALLOWED_TYPES) {
			if (type.equals(allowedType)) return true;
		}
			
		return false;
	}

    public RepositoriesFactory getRepositoriesFactory() {
        return repositoriesFactory;
    }

    public void setRepositoriesFactory(RepositoriesFactory repositoriesFactory) {
        this.repositoriesFactory = repositoriesFactory;
    }
}
