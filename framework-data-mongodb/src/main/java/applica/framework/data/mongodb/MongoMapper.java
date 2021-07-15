package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.annotations.ManyToMany;
import applica.framework.annotations.ManyToOne;
import applica.framework.annotations.OneToMany;
import applica.framework.data.IgnoreNestedReferences;
import applica.framework.library.utils.TypeUtils;
import com.mongodb.BasicDBObject;
import org.apache.commons.logging.Log;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class MongoMapper {

	@Autowired
	private RepositoriesFactory repositoriesFactory;

	private static Log logger = org.apache.commons.logging.LogFactory.getLog(MongoMapper.class);

	private static final Class<?>[] ALLOWED_TYPES = new Class<?>[]{
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

	public static class MappingConfig {
		private int nestedIgnoredReferenceCounter = 0;
		private boolean alwaysIgnoreNestedReferences;

		public void pushIgnoreNestedReferences() {
			nestedIgnoredReferenceCounter++;
		}

		public void popIgnoreNestedReferences() {
			if (nestedIgnoredReferenceCounter == 0) {
				throw new RuntimeException("nested ignored references counter cannot be negative");
			}

			nestedIgnoredReferenceCounter--;
		}

		public boolean isIgnoringNestedReferences() {
			return nestedIgnoredReferenceCounter > 0 || alwaysIgnoreNestedReferences;
		}

		public void setAlwaysIgnoreNestedReferences(boolean alwaysIgnoreNestedReferences) {
			this.alwaysIgnoreNestedReferences = alwaysIgnoreNestedReferences;
		}
	}

	public BasicDBObject loadBasicDBObject(Entity source, MappingConfig mappingConfig) {
		if (mappingConfig == null) {
			mappingConfig = new MappingConfig();
		}

		BasicDBObject document = new BasicDBObject();
		if (source != null && document != null) {
			Class<?> type = source.getClass();

			//put entity id in document
			if (source.getId() != null) {
				try {
					document.put("_id", new ObjectId(String.valueOf(source.getId())));
				} catch (Exception e) {
					//logger.warn(String.format("invalid id for entity %s: %s", type.getName(), source.getId()));
				}
			}

			//logger.warn("Converting " + type.getSimpleName());
			for (Field field : TypeUtils.getAllFields(type)) {
				if (!Modifier.isTransient(field.getModifiers()) && !Modifier.isStatic(field.getModifiers())) {
					//logger.warn(" --- field: " + field.getName());
					field.setAccessible(true);

					if (field.getName().equals("id")) {
						continue;
					} else {
						try {
							if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
								mappingConfig.pushIgnoreNestedReferences();
							}

							if (!mappingConfig.isIgnoringNestedReferences() && (field.getAnnotation(ManyToMany.class) != null || field.getAnnotation(OneToMany.class) != null)) {
								Object fieldSourceValue = field.get(source);
								if (fieldSourceValue != null && TypeUtils.isList(fieldSourceValue.getClass())) {
									List<?> sourceList = (List<?>) fieldSourceValue;
									ArrayList<Object> values = new ArrayList<Object>();
									Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
									Assert.isTrue(TypeUtils.isEntity(typeArgument), "ManyToMany not allowed for non-entity types: " + field.getName());
									Repository repository = repositoriesFactory.createForEntity((Class<? extends Entity>) typeArgument);
									Objects.requireNonNull(repository, "Repository for class not found: " + typeArgument.toString());
									for (Object el : sourceList) {
										Entity e = (Entity) el;
										values.add(e.getId());
									}
									document.put(field.getName(), values);
								}
							} else if (field.getAnnotation(ManyToOne.class) != null &&
									(!mappingConfig.isIgnoringNestedReferences() || field.getAnnotation(ManyToOne.class).forceIfIgnoreNestedReferences())) {
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
									Object basicDBObjectValue = convertToBasicDBObjectValue(fieldSourceValue, mappingConfig);
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
									mappingConfig.popIgnoreNestedReferences();
								}
							}
						}
					}
				}
			}
		}

		return document;
	}

	private Object convertToBasicDBObjectValue(Object source, MappingConfig mappingConfig) {
		Object value = null;
		if (TypeUtils.isEntity(source.getClass())) {
			try {
				//logger.warn("Field is entity");
				value = loadBasicDBObject((Entity) source, mappingConfig);
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
					Object elVal = convertToBasicDBObjectValue(el, mappingConfig);
					if (elVal != null) values.add(elVal);
				}
				value = values;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return value;
	}

	public Object loadObject(BasicDBObject source, Class<?> destinationType, MappingConfig mappingConfig) {
		if (mappingConfig == null) {
			mappingConfig = new MappingConfig();
		}

		Entity destination = null;
		try {
			destination = (Entity) destinationType.newInstance();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

		if (source != null && destination != null) {
			Class<?> type = destination.getClass();
			for (String key : source.keySet()) {
				if (key.equals("_id")) {
					destination.setId(source.getString(key));
				} else {
					Field field = null;

					try {
						field = TypeUtils.getField(type, key);

						if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
							mappingConfig.pushIgnoreNestedReferences();
						}

						if (!Modifier.isTransient(field.getModifiers()) && !Modifier.isStatic(field.getModifiers())) {
							field.setAccessible(true);

							if (key.endsWith("Id") && field.getType().equals(Object.class)) {
								field.set(destination, source.get(field.getName()));
							} else if (TypeUtils.isEntity(field.getType())) {
								if ((isId(source, field)) && field.getAnnotation(ManyToOne.class) != null) {
									Entity value = null;
									String sourceId = (String) source.get(field.getName());
									if (!mappingConfig.isIgnoringNestedReferences()) {
										Repository repository = repositoriesFactory.createForEntity((Class<? extends Entity>) field.getType());
										Objects.requireNonNull(repository, "Repository for class not found: " + field.getType().toString());
										value = (Entity) repository.get(sourceId).orElse(null);

									} else {
										Class<?> clazz = Class.forName(field.getType().getName());
										value = generateEntityWithId(sourceId, clazz);
									}
									if (value != null) {
										field.set(destination, value);
									}
								} else {
									BasicDBObject childDocument = (BasicDBObject) source.get(key);
									Object value = loadObject(childDocument, field.getType(), mappingConfig);
									field.set(destination, value);
								}
							} else if (field.getType().equals(Key.class)) {
								field.set(destination, new Key(source.get(key)));
							} else if (isAllowed(field.getType())) {
								field.set(destination, source.get(key));
							} else if (TypeUtils.isList(field.getType())) {
								if (( firstIsId(source, field)) && (field.getAnnotation(ManyToMany.class) != null || field.getAnnotation(OneToMany.class) != null)) {
									ArrayList<Object> values = new ArrayList<Object>();
									Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
									Assert.isTrue(TypeUtils.isEntity(typeArgument), "ManyToMany not allowed for non-entity types: " + field.getName());
									List<?> sourceList = (List<?>) source.get(field.getName());
									if (!mappingConfig.isIgnoringNestedReferences()) {
										Repository repository = repositoriesFactory.createForEntity((Class<? extends Entity>) typeArgument);
										Objects.requireNonNull(repository, "Repository for class not found: " + typeArgument.toString());
										for (Object el : sourceList) {
											repository.get(el).ifPresent(values::add);
										}
									} else {
										values.addAll(sourceList.stream().map(id -> {
											try {
												return generateEntityWithId((String) id, typeArgument);
											} catch (Exception e) {
												e.printStackTrace();
												return null;
											}
										}).collect(Collectors.toList()));
									}

									field.set(destination, values);
								} else {
									ArrayList<Object> values = new ArrayList<Object>();
									Class<?> typeArgument = TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType());
									List<?> sourceList = (List<?>) source.get(field.getName());
									for (Object el : sourceList) {
										if (TypeUtils.isEntity(typeArgument)) {
											values.add(loadObject((BasicDBObject) el, typeArgument, mappingConfig));
										} else if (isAllowed(typeArgument)) {
											values.add(el);
										} else if (Object.class.equals(typeArgument)) {
											values.add(el);
										}
									}
									field.set(destination, values);
								}
							}

						}
					} catch (NoSuchFieldException e) {
						logger.warn("Field in database " + key + " isn't available on class");
					} catch (Exception e) {
						logger.warn("Error in field " + key);
						e.printStackTrace();
					} finally {
						if (field != null) {
							if (field.getAnnotation(IgnoreNestedReferences.class) != null) {
								mappingConfig.popIgnoreNestedReferences();
							}
						}
					}
				}
			}
		}

		return destination;
	}

	private Entity generateEntityWithId(String id, Class clazz) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
		Constructor<?> ctor = clazz.getConstructor();
		Object object = ctor.newInstance();
		((Entity) object).setId(id);
		return ((Entity) object);
	}

	private boolean firstIsId(BasicDBObject source, Field field) {
		if (source == null) {
			return false;
		}

		List<?> sourceList = (List<?>) source.get(field.getName());
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

		for (Class<?> allowedType : ALLOWED_TYPES) {
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
