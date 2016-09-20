package applica.framework.widgets;

import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.Sort;
import applica.framework.library.utils.TypeUtils;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.annotations.Params;
import applica.framework.widgets.mapping.PropertyMapper;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.render.CellRenderer;
import applica.framework.widgets.render.FormFieldRenderer;
import applica.framework.widgets.render.FormRenderer;
import applica.framework.widgets.render.GridRenderer;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.util.StringUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CrudConfiguration implements CrudConstants {
    private CrudConfiguration() {
    }

    private static CrudConfiguration s_instance = null;

    public static CrudConfiguration instance() {
        if (s_instance == null)
            s_instance = new CrudConfiguration();

        return s_instance;
    }

    private CrudFactory crudFactory = null;

    private List<GridRendererInfo> gridRendererInfos = new ArrayList<>();
    private List<FormRendererInfo> formRendererInfos = new ArrayList<>();
    private List<RepositoryInfo> gridRepositoryInfos = new ArrayList<>();
    private List<RepositoryInfo> formRepositoryInfos = new ArrayList<>();
    private List<GridDescriptorInfo> gridDescriptorInfos = new ArrayList<>();
    private List<TypeAlias> gridAliases = new ArrayList<>();
    private List<TypeAlias> formAliases = new ArrayList<>();
    private List<FormFieldRendererInfo> formFieldRendererInfos = new ArrayList<>();
    private List<CellRendererInfo> cellRendererInfos = new ArrayList<>();
    private List<FormDescriptorInfo> formDescriptorInfos = new ArrayList<>();
    private List<FormProcessorInfo> formProcessorInfos = new ArrayList<>();
    private List<FormIdentifier> formIdentifiers = new ArrayList<>();
    private List<FormExtraDataInfo> formExtraDataInfos = new ArrayList<>();
    private List<SearchableInfo> searchableInfos = new ArrayList<>();
    private List<SortByInfo> sortByInfos = new ArrayList<>();
    private List<Param> params = new ArrayList<>();
    private List<PropertyParam> propertyParams = new ArrayList<>();
    private List<PropertyMapperInfo> propertyMapperInfos = new ArrayList<>();
    private List<SearchCriteriaInfo> searchCriteriaInfos = new ArrayList<>();
    private List<VisibilityInfo> visibilityInfos = new ArrayList<>();

    private Log logger = LogFactory.getLog(getClass());

    public void scan(Package... packages) throws InstantiationException, IllegalAccessException {
        logger.info("Scanning packages...");

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(applica.framework.widgets.annotations.Grid.class));
        scanner.addIncludeFilter(new AnnotationTypeFilter(applica.framework.widgets.annotations.Form.class));

        List<Class<?>> types = new ArrayList<>();
        for (Package myPackage : packages) {
            logger.info(" ********** Scanning package " + myPackage.getName() + " **********");
            for (BeanDefinition bean : scanner.findCandidateComponents(myPackage.getName())) {
                logger.info("Bean definition found " + bean.getBeanClassName());
                try {
                    Class<?> type = Class.forName(bean.getBeanClassName());
                    types.add(type);
                } catch (ClassNotFoundException e) {
                    logger.error("Error loading class type for bean definition");
                    e.printStackTrace();
                }
            }
        }

        for (Class<?> type : types) {
            logger.info("Scanning type " + type.getName());

            scanForGrid(type);
            scanForForm(type);
            scanParams(type);
            scanPropertyParams(type);
        }
    }

    @SuppressWarnings("unchecked")
    private void scanPropertyParams(Class<?> type) {
        List<Field> fields = TypeUtils.getAllFields(type);
        for (Field field : fields) {
            logger.info("scanning field params: " + field.getName());
            Annotation[] paramAnnotations = field.getAnnotations();
            for(Annotation a : paramAnnotations) {
                if(a instanceof applica.framework.widgets.annotations.Param) {
                    applica.framework.widgets.annotations.Param pa = (applica.framework.widgets.annotations.Param)a;
                    CrudConfiguration.instance().setPropertyParam((Class<? extends Entity>) type, field.getName(), pa.key(), pa.value());
                    logger.info(String.format("Registered parameter for property %s: %s = %s", field.getName(), pa.key(), pa.value()));
                } else if(a instanceof applica.framework.widgets.annotations.Params) {
                    for(applica.framework.widgets.annotations.Param p : ((Params) a).value()) {
                        CrudConfiguration.instance().setPropertyParam((Class<? extends Entity>) type, field.getName(), p.key(), p.value());
                        logger.info(String.format("Registered parameter for property %s: %s = %s", field.getName(), p.key(), p.value()));
                    }
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void scanParams(Class<?> type) {
        Annotation[] annotations = type.getAnnotations();
        for (Annotation annotation : annotations) {
            if (annotation instanceof applica.framework.widgets.annotations.Param) {
                applica.framework.widgets.annotations.Param param = (applica.framework.widgets.annotations.Param) annotation;
                if (param != null) {
                    setParam(((Class<? extends Entity>) type), param.key(), param.value());
                    logger.info(String.format("Registered parameter for type %s: %s = %s", type, param.key(), param.value()));
                } else if(param instanceof applica.framework.widgets.annotations.Params) {
                    for(applica.framework.widgets.annotations.Param p : ((Params) param).value()) {
                        CrudConfiguration.instance().setParam((Class<? extends Entity>) type, p.key(), p.value());
                        logger.info(String.format("Registered parameter for type %s: %s = %s", type, p.key(), p.value()));
                    }
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void scanForForm(Class<?> type) {
        applica.framework.widgets.annotations.Form formAnnotation = type.getAnnotation(applica.framework.widgets.annotations.Form.class);
        if (formAnnotation != null) {
            logger.info(type.getName() + " has FORM annotation");

            TypeAlias formAlias = new TypeAlias();
            formAlias.identifier = (formAnnotation.value());
            formAlias.type = ((Class<? extends Entity>) type);

            String title = formAnnotation.title();
            String action = formAnnotation.action();

            applica.framework.widgets.annotations.FormRenderer formRenderer = type.getAnnotation(applica.framework.widgets.annotations.FormRenderer.class);
            applica.framework.widgets.annotations.FormProcessor formProcessor = type.getAnnotation(applica.framework.widgets.annotations.FormProcessor.class);
            applica.framework.widgets.annotations.Repository loader = type.getAnnotation(applica.framework.widgets.annotations.Repository.class);
            applica.framework.widgets.annotations.FormMethod method = type.getAnnotation(applica.framework.widgets.annotations.FormMethod.class);

            CrudConfiguration.instance().registerForm(formAlias.type, formAlias.identifier, title, action);

            if (formRenderer != null)
                CrudConfiguration.instance().registerFormRenderer(formAlias.type, formRenderer.value());
            if (loader != null)
                CrudConfiguration.instance().registerFormRepository(formAlias.type, loader.value());
            if (formProcessor != null)
                CrudConfiguration.instance().registerFormProcessor(formAlias.type, formProcessor.value());
            if(method != null)
                CrudConfiguration.instance().registerFormMethod(formAlias.type, method.value());

            List<Field> fields = TypeUtils.getAllFields(formAlias.type);
            for (Field field : fields) {
                logger.info("scanning field " + field.getName());

                applica.framework.widgets.annotations.FormField formFieldAnnotation = field.getAnnotation(applica.framework.widgets.annotations.FormField.class);

                if (formFieldAnnotation != null) {
                    logger.info(field.getName() + " is a form field");

                    String property = field.getName();
                    String description = formFieldAnnotation.description();
                    String fieldSet = null;

                    if (!StringUtils.hasLength(description)) description = property;

                    logger.info(String.format("Field %s as description: %s", property, description));

                    applica.framework.widgets.annotations.FormFieldRenderer rendererAnnotation = field.getAnnotation(applica.framework.widgets.annotations.FormFieldRenderer.class);
                    if (rendererAnnotation != null) {
                        CrudConfiguration.instance().registerFormFieldRenderer(formAlias.type, property, rendererAnnotation.value());
                        logger.info("Registered field renderer class: " + rendererAnnotation.value());

                    }

                    applica.framework.widgets.mapping.annotations.PropertyMapper propertyMapperAnnotation = field.getAnnotation(applica.framework.widgets.mapping.annotations.PropertyMapper.class);
                    if(propertyMapperAnnotation != null) {
                        CrudConfiguration.instance().registerPropertyMapper(formAlias.type, property, propertyMapperAnnotation.value());
                        logger.info("Registered property mapper class: " + propertyMapperAnnotation.value());
                    }

                    applica.framework.widgets.annotations.SearchCriteria searchCriteriaAnnotation = field.getAnnotation(applica.framework.widgets.annotations.SearchCriteria.class);
                    if(searchCriteriaAnnotation != null) {
                        CrudConfiguration.instance().registerSearchCriteria(formAlias.type, property, searchCriteriaAnnotation.value());
                        logger.info("Registered field search criteria: " + searchCriteriaAnnotation.value());
                    }

                    applica.framework.widgets.annotations.FieldSet fieldSetAnnotation = field.getAnnotation(applica.framework.widgets.annotations.FieldSet.class);
                    if(fieldSetAnnotation != null) {
                        fieldSet = fieldSetAnnotation.value();
                        logger.info("Registered field fieldSet: " + fieldSetAnnotation.value());
                    }

                    CrudConfiguration.instance().registerFormField(formAlias.type, property, field.getGenericType(), description, fieldSet);
                }
            }

            //search for buttons
            applica.framework.widgets.annotations.FormButtons buttons = type.getAnnotation(applica.framework.widgets.annotations.FormButtons.class);
            if(buttons != null) {
                if(buttons.value() != null && buttons.value().length > 0) {
                    for(applica.framework.widgets.annotations.FormButton button : buttons.value()) {
                        CrudConfiguration.instance().registerFormButton(formAlias.type, button.label(), button.type(), button.action());
                    }
                }
            }
        } else {
            logger.warn(type.getName() + " has NOT FORM annotation");
        }
    }

    @SuppressWarnings("unchecked")
    private void scanForGrid(Class<?> type) {
        applica.framework.widgets.annotations.Grid gridAnnotation = type.getAnnotation(applica.framework.widgets.annotations.Grid.class);
        if (gridAnnotation != null) {
            logger.info(type.getName() + " has GRID annotation");

            TypeAlias gridAlias = new TypeAlias();
            gridAlias.identifier = (gridAnnotation.value());
            gridAlias.type = ((Class<? extends Entity>) type);

            String title = gridAnnotation.title();

            applica.framework.widgets.annotations.GridRenderer gridRenderer = type.getAnnotation(applica.framework.widgets.annotations.GridRenderer.class);
            applica.framework.widgets.annotations.Repository loader = type.getAnnotation(applica.framework.widgets.annotations.Repository.class);
            applica.framework.widgets.annotations.Searchable searchable = type.getAnnotation(applica.framework.widgets.annotations.Searchable.class);
            applica.framework.widgets.annotations.SortBy sortBy = type.getAnnotation(applica.framework.widgets.annotations.SortBy.class);

            if (gridRenderer != null)
                CrudConfiguration.instance().registerGridRenderer(gridAlias.type, gridRenderer.value());
            if (loader != null) CrudConfiguration.instance().registerGridRepository(gridAlias.type, loader.value());

            CrudConfiguration.instance().registerGrid(gridAlias.type, gridAlias.identifier, title);

            if (StringUtils.hasLength(gridAnnotation.form())) {
                registerGridFormIdentifier(gridAlias.identifier, gridAnnotation.form());
            }

            if (searchable != null) {
                logger.info("Grid has searchable: " + searchable.value().getName());

                registerSearchable(gridAlias.type, searchable.value());
            }

            if (sortBy != null) {
                logger.info("Grid has default sort: " + sortBy.value());

                registerSortBy(gridAlias.type, sortBy.value(), sortBy.descending());
            }

            List<Field> fields = TypeUtils.getAllFields(gridAlias.type);
            for (Field field : fields) {
                logger.info("scanning field " + field.getName());

                applica.framework.widgets.annotations.GridColumn gridColumnAnnotation = field.getAnnotation(applica.framework.widgets.annotations.GridColumn.class);
                if (gridColumnAnnotation != null) {
                    logger.info(field.getName() + " is displayable in grid");

                    String header = gridColumnAnnotation.header();
                    if (!StringUtils.hasLength(header)) header = field.getName();

                    logger.info(String.format("%s header: %s", field.getName(), header));

                    CrudConfiguration.instance().registerGridColumn(gridAlias.type, field.getName(), header, field.getType(), gridColumnAnnotation.linked());

                    applica.framework.widgets.annotations.CellRenderer cellRendererAnnotation = field.getAnnotation(applica.framework.widgets.annotations.CellRenderer.class);
                    if (cellRendererAnnotation != null) {
                        CrudConfiguration.instance().registerCellRenderer(gridAlias.type, field.getName(), cellRendererAnnotation.value());
                        logger.info("Registered cell render builder: " + cellRendererAnnotation.value().getName());
                    }
                }
            }
        } else {
            logger.warn(type.getName() + " has NOT GRID annotation");
        }
    }

    public void registerGrid(Class<? extends Entity> type, String identifier, String title) {
        TypeAlias alias = new TypeAlias();
        alias.identifier = identifier;
        alias.type = type;
        alias.title = title;

        gridAliases.add(alias);
    }

    public Class<? extends Entity> getGridTypeFromIdentifier(final String identifier) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(gridAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).identifier.equals(identifier);
            }
        });

        if (alias != null) {
            return alias.type;
        }

        return null;
    }

    public String getGridIdentifierFromType(final Class<? extends Entity> type) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(gridAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).type.equals(type);
            }
        });

        if (alias != null) {
            return alias.identifier;
        }

        return null;
    }

    public String getGridTitle(final Class<? extends Entity> type) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(gridAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).type.equals(type);
            }
        });

        if (alias != null) {
            return alias.title;
        }

        return null;
    }

    public void registerForm(Class<? extends Entity> type, String identifier, String title, String action) {
        TypeAlias alias = new TypeAlias();
        alias.identifier = identifier;
        alias.type = type;
        alias.title = title;
        alias.action = action;

        formAliases.add(alias);
    }

    public void registerFormMethod(final Class<? extends Entity> type, String method) {
        FormExtraDataInfo info = (FormExtraDataInfo) CollectionUtils.find(formExtraDataInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormExtraDataInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new FormExtraDataInfo();
            info.type = type;
            formExtraDataInfos.add(info);
        }

        info.method = method;
    }

    public String getFormMethod(final Class<? extends Entity> type) {
        FormExtraDataInfo data = (FormExtraDataInfo) CollectionUtils.find(formExtraDataInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormExtraDataInfo) item).type.equals(type);
            }
        });

        if(data != null) {
            return data.method;
        } else {
            return null;
        }
    }

    public void registerGridFormIdentifier(String grid, String form) {
        FormIdentifier identifier = new FormIdentifier();
        identifier.grid = grid;
        identifier.form = form;

        formIdentifiers.add(identifier);
    }

    public String getGridFormIdentifier(final String grid) {
        FormIdentifier identifier = (FormIdentifier) CollectionUtils.find(formIdentifiers, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormIdentifier) item).grid.equals(grid);
            }
        });

        if (identifier != null) {
            return identifier.form;
        }

        return grid;
    }

    public Class<? extends Entity> getFormTypeFromIdentifier(final String identifier) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(formAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).identifier.equals(identifier);
            }
        });

        if (alias != null) {
            return alias.type;
        }

        return null;
    }

    public String getFormIdentifierFromType(final Class<? extends Entity> type) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(formAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).type.equals(type);
            }
        });

        if (alias != null) {
            return alias.identifier;
        }

        return null;
    }

    public String getFormTitle(final Class<? extends Entity> type) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(formAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).type.equals(type);
            }
        });

        if (alias != null) {
            return alias.title;
        }

        return null;
    }

    public String getFormAction(final Class<? extends Entity> type) {
        TypeAlias alias = (TypeAlias) CollectionUtils.find(formAliases, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((TypeAlias) item).type.equals(type);
            }
        });

        if (alias != null) {
            return alias.action;
        }

        return null;
    }

    public void registerGridRenderer(final Class<? extends Entity> type, Class<? extends GridRenderer> renderer) {
        GridRendererInfo info = (GridRendererInfo) CollectionUtils.find(gridRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((GridRendererInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new GridRendererInfo();
            info.type = type;
            gridRendererInfos.add(info);
        }

        info.renderer = renderer;
    }

    public void registerSearchable(final Class<? extends Entity> type, Class<? extends Entity> searchableType) {
        SearchableInfo info = (SearchableInfo) CollectionUtils.find(searchableInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((SearchableInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new SearchableInfo();
            info.type = type;
            searchableInfos.add(info);
        }

        info.searchableType = searchableType;
    }

    public void registerSortBy(final Class<? extends Entity> type, String property, boolean descending) {
        SortByInfo info = (SortByInfo) CollectionUtils.find(sortByInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((SortByInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new SortByInfo();
            info.type = type;
            sortByInfos.add(info);
        }

        info.property = property;
        info.descending = descending;
    }

    public void registerFormRenderer(final Class<? extends Entity> type, Class<? extends FormRenderer> renderer) {
        FormRendererInfo info = (FormRendererInfo) CollectionUtils.find(formRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormRendererInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new FormRendererInfo();
            info.type = type;
            formRendererInfos.add(info);
        }

        info.renderer = renderer;
    }

    public void registerFormProcessor(final Class<? extends Entity> type, Class<? extends FormProcessor> processor) {
        FormProcessorInfo info = (FormProcessorInfo) CollectionUtils.find(formProcessorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormProcessorInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new FormProcessorInfo();
            info.type = type;
            formProcessorInfos.add(info);
        }

        info.processor = processor;
    }

    public void registerFormFieldRenderer(final Class<? extends Entity> type, final String property, Class<? extends FormFieldRenderer> renderer) {
        FormFieldRendererInfo info = (FormFieldRendererInfo) CollectionUtils.find(formFieldRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                FormFieldRendererInfo info = (FormFieldRendererInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = new FormFieldRendererInfo();
            info.type = type;
            info.property = property;
            formFieldRendererInfos.add(info);
        }

        info.renderer = renderer;
    }

    public void registerPropertyMapper(final Class<? extends Entity> type, final String property, Class<? extends PropertyMapper> propertyMapper) {
        PropertyMapperInfo info = (PropertyMapperInfo) CollectionUtils.find(propertyMapperInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                PropertyMapperInfo info = (PropertyMapperInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = new PropertyMapperInfo();
            info.type = type;
            info.property = property;
            propertyMapperInfos.add(info);
        }

        info.mapper = propertyMapper;
    }

    public void registerSearchCriteria(final Class<? extends Entity> type, final String property, String criteria) {
        SearchCriteriaInfo info = (SearchCriteriaInfo) CollectionUtils.find(searchCriteriaInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                SearchCriteriaInfo info = (SearchCriteriaInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = new SearchCriteriaInfo();
            info.type = type;
            info.property = property;
            searchCriteriaInfos.add(info);
        }

        info.criteria = criteria;
    }

    public void registerCellRenderer(final Class<? extends Entity> type, final String property, Class<? extends CellRenderer> renderer) {
        CellRendererInfo info = (CellRendererInfo) CollectionUtils.find(cellRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                CellRendererInfo info = (CellRendererInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = new CellRendererInfo();
            info.type = type;
            info.property = property;
            cellRendererInfos.add(info);
        }

        info.renderer = renderer;
    }

    public void registerGridRepository(final Class<? extends Entity> type, Class<? extends Repository> repository) {
        RepositoryInfo info = (RepositoryInfo) CollectionUtils.find(gridRepositoryInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((RepositoryInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new RepositoryInfo();
            info.type = type;
            gridRepositoryInfos.add(info);
        }

        info.repository = repository;
    }

    public void registerFormRepository(final Class<? extends Entity> type, Class<? extends Repository> repository) {
        RepositoryInfo info = (RepositoryInfo) CollectionUtils.find(formRepositoryInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((RepositoryInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new RepositoryInfo();
            info.type = type;
            formRepositoryInfos.add(info);
        }

        info.repository = repository;
    }

    public void registerGridColumn(final Class<? extends Entity> type, String property, String header, Type dataType, boolean linked) {
        GridDescriptorInfo info = (GridDescriptorInfo) CollectionUtils.find(gridDescriptorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((GridDescriptorInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new GridDescriptorInfo();
            info.type = type;
            info.descriptor = new GridDescriptor(null);

            gridDescriptorInfos.add(info);
        }

        info.descriptor.addColumn(property, header, dataType, linked, null);
    }

    public void registerFormField(final Class<? extends Entity> type, String property, Type dataType, String description, String fieldSet) {
        FormDescriptorInfo info = (FormDescriptorInfo) CollectionUtils.find(formDescriptorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormDescriptorInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new FormDescriptorInfo();
            info.type = type;
            info.descriptor = new FormDescriptor(null);

            formDescriptorInfos.add(info);
        }

        info.descriptor.addField(property, dataType, description, fieldSet, null);
    }

    public void registerFormButton(final Class<? extends Entity> type, String label, String buttonType, String action) {
        FormDescriptorInfo info = (FormDescriptorInfo) CollectionUtils.find(formDescriptorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormDescriptorInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new FormDescriptorInfo();
            info.type = type;
            info.descriptor = new FormDescriptor(null);

            formDescriptorInfos.add(info);
        }

        info.descriptor.addButton(label, buttonType, action);
    }

    public GridDescriptor getGridDescriptor(final Class<? extends Entity> type) throws CrudConfigurationException {
        GridDescriptorInfo info = (GridDescriptorInfo) CollectionUtils.find(gridDescriptorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((GridDescriptorInfo) item).type.equals(type);
            }
        });

        if (info == null) throw new CrudConfigurationException("No descriptor for " + type.getName());

        return info.descriptor;
    }

    public Class<? extends Entity> getSearchable(final Class<? extends Entity> type) {
        SearchableInfo info = (SearchableInfo) CollectionUtils.find(searchableInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((SearchableInfo) item).type.equals(type);
            }
        });

        if (info != null)
            return info.searchableType;

        return null;
    }

    public Sort getSortBy(final Class<? extends Entity> type) {
        SortByInfo info = (SortByInfo) CollectionUtils.find(sortByInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((SortByInfo) item).type.equals(type);
            }
        });

        if (info != null) {
            Sort sort = new Sort();
            sort.setProperty(info.property);
            sort.setDescending(info.descending);
            return sort;
        }

        return null;
    }

    public FormDescriptor getFormDescriptor(final Class<? extends Entity> type) throws CrudConfigurationException {
        FormDescriptorInfo info = (FormDescriptorInfo) CollectionUtils.find(formDescriptorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormDescriptorInfo) item).type.equals(type);
            }
        });

        if (info == null) throw new CrudConfigurationException("No descriptor for " + type.getName());

        return info.descriptor;
    }

    public FormProcessor getFormProcessor(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        FormProcessorInfo info = (FormProcessorInfo) CollectionUtils.find(formProcessorInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormProcessorInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = (FormProcessorInfo) CollectionUtils.find(formProcessorInfos, new Predicate() {
                @Override
                public boolean evaluate(Object item) {
                    return ((FormProcessorInfo) item).type.equals(CrudConstants.DEFAULT_ENTITY_TYPE);
                }
            });
        }

        if (info == null) throw new CrudConfigurationException("No processor for " + type.getName());

        FormProcessor processor = crudFactory.createFormProcessor(info.processor, type, getFormIdentifierFromType(type));
        if (processor == null)
            throw new CrudConfigurationException("FormProcessor not found for type " + type.getName());
        return processor;
    }

    public GridRenderer getGridRenderer(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        GridRendererInfo info = (GridRendererInfo) CollectionUtils.find(gridRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((GridRendererInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = (GridRendererInfo) CollectionUtils.find(gridRendererInfos, new Predicate() {
                @Override
                public boolean evaluate(Object item) {
                    return ((GridRendererInfo) item).type.equals(CrudConstants.DEFAULT_ENTITY_TYPE);
                }
            });
        }

        if (info == null)
            throw new CrudConfigurationException("No grid renderer builder provided for " + type.getName());

        GridRenderer renderer = crudFactory.createGridRenderer(info.renderer, type, getGridIdentifierFromType(type));
        if (renderer == null) throw new CrudConfigurationException("GridRenderer not found for type " + type.getName());
        return renderer;
    }

    public FormRenderer getFormRenderer(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        FormRendererInfo info = (FormRendererInfo) CollectionUtils.find(formRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((FormRendererInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = (FormRendererInfo) CollectionUtils.find(formRendererInfos, new Predicate() {
                @Override
                public boolean evaluate(Object item) {
                    return ((FormRendererInfo) item).type.equals(CrudConstants.DEFAULT_ENTITY_TYPE);
                }
            });
        }

        if (info == null)
            throw new CrudConfigurationException("No form renderer builder provided for " + type.getName());

        FormRenderer renderer = crudFactory.createFormRenderer(info.renderer, type, getFormIdentifierFromType(type));
        if (renderer == null) throw new CrudConfigurationException("FormRenderer not found for type " + type.getName());
        return renderer;
    }

    public FormFieldRenderer getFormFieldRenderer(final Class<? extends Entity> type, final String property) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        FormFieldRendererInfo info = (FormFieldRendererInfo) CollectionUtils.find(formFieldRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                FormFieldRendererInfo info = (FormFieldRendererInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = (FormFieldRendererInfo) CollectionUtils.find(formFieldRendererInfos, new Predicate() {
                @Override
                public boolean evaluate(Object item) {
                    FormFieldRendererInfo info = (FormFieldRendererInfo) item;
                    return info.type.equals(CrudConstants.DEFAULT_ENTITY_TYPE);
                }
            });
        }

        if (info == null)
            throw new CrudConfigurationException("No form field renderer builder provided for " + type.getName() + " of property " + property);

        FormFieldRenderer renderer = crudFactory.createFormFieldRenderer(info.renderer, type, getFormIdentifierFromType(type), property);
        if (renderer == null)
            throw new CrudConfigurationException("FormFieldRenderer not found for type " + type.getName());
        return renderer;
    }

    public CellRenderer getCellRenderer(final Class<? extends Entity> type, final String property) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        CellRendererInfo info = (CellRendererInfo) CollectionUtils.find(cellRendererInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                CellRendererInfo info = (CellRendererInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if (info == null) {
            info = (CellRendererInfo) CollectionUtils.find(cellRendererInfos, new Predicate() {
                @Override
                public boolean evaluate(Object item) {
                    CellRendererInfo info = (CellRendererInfo) item;
                    return info.type.equals(CrudConstants.DEFAULT_ENTITY_TYPE);
                }
            });
        }

        if (info == null)
            throw new CrudConfigurationException("No cell renderer builder provided for " + type.getName() + " of property " + property);

        CellRenderer renderer = crudFactory.createCellRenderer(info.renderer, type, getGridIdentifierFromType(type), property);
        if (renderer == null) throw new CrudConfigurationException("CellRenderer not found for type " + type.getName());
        return renderer;
    }

    public PropertyMapper getPropertyMapper(final Class<? extends Entity> type, final String property) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        PropertyMapperInfo info = (PropertyMapperInfo) CollectionUtils.find(propertyMapperInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                PropertyMapperInfo info = (PropertyMapperInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if(info != null) {
            return crudFactory.createPropertyMapper(info.mapper, type, getFormIdentifierFromType(type), property);
        }

        return null;
    }

    public String getSearchCriteria(final Class<? extends Entity> type, final String property) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        SearchCriteriaInfo info = (SearchCriteriaInfo) CollectionUtils.find(searchCriteriaInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                SearchCriteriaInfo info = (SearchCriteriaInfo) item;
                return info.type.equals(type) && info.property.equals(property);
            }
        });

        if(info != null) {
            return info.criteria;
        }

        return null;
    }

    public Repository getGridRepository(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        RepositoryInfo info = (RepositoryInfo) CollectionUtils.find(gridRepositoryInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((RepositoryInfo) item).type.equals(type);
            }
        });

        Repository repository = crudFactory.createRepository(info != null ? info.repository : null, type);
        if (repository == null) throw new CrudConfigurationException("Repository not found for type " + type.getName());
        return repository;
    }

    public Repository getFormRepository(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        RepositoryInfo info = (RepositoryInfo) CollectionUtils.find(formRepositoryInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((RepositoryInfo) item).type.equals(type);
            }
        });

        Repository repository = crudFactory.createRepository(info != null ? info.repository : null, type);
        if (repository == null) throw new CrudConfigurationException("Repository not found for type " + type.getName());
        return repository;
    }

    private Param getParamInternal(Class<? extends Entity> type, String key) {
        for (Param param : params) {
            if (param.type.equals(type) && param.key.equals(key)) return param;
        }

        return null;
    }

    public void setParam(Class<? extends Entity> type, String key, String value) {
        Param param = getParamInternal(type, key);
        if (param == null) {
            param = new Param();
            param.key = key;
            param.type = type;
            params.add(param);
        }

        param.value = value;
    }

    public String getParam(Class<? extends Entity> type, String key) {
        return getParam(type, key, null);
    }

    public String getParam(Class<? extends Entity> type, String key, String fallback) {
        Param param = getParamInternal(type, key);
        if (param != null) {
            return param.value;
        }

        return fallback;
    }

    public Map<String, String> getParams(Class<? extends Entity> type) {
        Map<String, String> paramsMap = new HashMap<>();
        List<PropertyParam> filteredParams = (List<PropertyParam>) CollectionUtils.select(this.propertyParams, new Predicate() {
            @Override
            public boolean evaluate(Object o) {
                return ((PropertyParam) o).type.equals(type);
            }
        });

        for(PropertyParam p : filteredParams) {
            paramsMap.put(p.key, p.value);
        }

        return paramsMap;
    }

    public String getDefaultParam(Class<? extends Entity> type, String key) {
        return getDefaultParam(type, key, null);
    }

    public String getDefaultParam(Class<? extends Entity> type, String key, String fallback) {
        Param param = getParamInternal(type, key);
        if (param == null) {
            param = getParamInternal(DEFAULT_ENTITY_TYPE, key);
        }

        if (param != null) {
            return param.value;
        }

        return fallback;
    }

    private PropertyParam getPropertyParamInternal(Class<? extends Entity> type, String property, String key) {
        for (PropertyParam param : propertyParams) {
            if (param.type.equals(type) && param.property.equals(property) && param.key.equals(key)) return param;
        }

        return null;
    }

    public void setPropertyParam(Class<? extends Entity> type, String property, String key, String value) {
        PropertyParam param = getPropertyParamInternal(type, property, key);
        if (param == null) {
            param = new PropertyParam();
            param.key = key;
            param.type = type;
            param.property = property;
            propertyParams.add(param);
        }

        param.value = value;
    }

    public String getPropertyParam(Class<? extends Entity> type, String property, String key) {
        return getPropertyParam(type, key, property, null);
    }

    public String getPropertyParam(Class<? extends Entity> type, String property, String key, String fallback) {
        PropertyParam param = getPropertyParamInternal(type, property, key);
        if (param != null) {
            return param.value;
        }

        return fallback;
    }

    public Map<String, String> getPropertyParams(Class<? extends Entity> type, final String property) {
        Map<String, String> paramsMap = new HashMap<>();
        List<PropertyParam> filteredParams = (List<PropertyParam>) CollectionUtils.select(this.propertyParams, new Predicate() {
            @Override
            public boolean evaluate(Object o) {
                return ((PropertyParam) o).property.equals(property) && ((PropertyParam) o).type.equals(type);
            }
        });

        for(PropertyParam p : filteredParams) {
            paramsMap.put(p.key, p.value);
        }

        return paramsMap;
    }

    public CrudFactory getCrudFactory() {
        return crudFactory;
    }

    public void setCrudFactory(CrudFactory crudFactory) {
        this.crudFactory = crudFactory;
    }

    public void registerVisibility(Class<? extends Entity> type, Class<? extends Visibility> visibility) {
        VisibilityInfo info = (VisibilityInfo) CollectionUtils.find(visibilityInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((VisibilityInfo) item).type.equals(type);
            }
        });

        if (info == null) {
            info = new VisibilityInfo();
            info.type = type;
            visibilityInfos.add(info);
        }

        info.visibility = visibility;
    }

    public Visibility getVisibility(final Class<? extends Entity> type) throws CrudConfigurationException {
        if (crudFactory == null) throw new CrudConfigurationException("Please set framework factory");

        VisibilityInfo info = (VisibilityInfo) CollectionUtils.find(visibilityInfos, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return ((VisibilityInfo) item).type.equals(type);
            }
        });

        if (info != null) {
            Visibility visibility = crudFactory.createVisibility(info.visibility);
            return visibility;
        }

        return null;
    }

    class VisibilityInfo {
        private Class<? extends Entity> type;
        private Class<? extends Visibility> visibility;
    }

    class GridRendererInfo {
        private Class<? extends Entity> type;
        private Class<? extends GridRenderer> renderer;
    }

    class FormRendererInfo {
        private Class<? extends Entity> type;
        private Class<? extends FormRenderer> renderer;
    }

    class FormFieldRendererInfo {
        public Class<? extends Entity> type;
        private String property;
        private Class<? extends FormFieldRenderer> renderer;
    }

    class CellRendererInfo {
        public Class<? extends Entity> type;
        private String property;
        private Class<? extends CellRenderer> renderer;
    }

    class RepositoryInfo {
        private Class<? extends Entity> type;
        private Class<? extends Repository> repository;
    }

    class FormProcessorInfo {
        private Class<? extends Entity> type;
        private Class<? extends FormProcessor> processor;
    }

    class GridDescriptorInfo {
        private Class<? extends Entity> type;
        private GridDescriptor descriptor;
    }

    class FormDescriptorInfo {
        private Class<? extends Entity> type;
        private FormDescriptor descriptor;
    }

    class TypeAlias {
        private Class<? extends Entity> type;
        private String identifier;
        private String title;
        private String action;
    }

    class FormIdentifier {
        String grid;
        String form;
    }

    class SearchableInfo {
        private Class<? extends Entity> type;
        private Class<? extends Entity> searchableType;
    }

    class SortByInfo {
        private Class<? extends Entity> type;
        private String property;
        private boolean descending;
    }

    class Param {
        private Class<? extends Entity> type;
        private String key;
        private String value;
    }

    class PropertyParam {
        private Class<? extends Entity> type;
        private String property;
        private String key;
        private String value;
    }

    class FormExtraDataInfo {
        private Class<? extends Entity> type;
        private String method;
    }

    class PropertyMapperInfo {
        private Class<? extends Entity> type;
        private String property;
        private Class<? extends PropertyMapper> mapper;
    }

    class SearchCriteriaInfo {
        private Class<? extends Entity> type;
        private String property;
        private String criteria;
    }
}
