package applica.framework.security;


import applica.framework.Query;

public interface CodeGeneratorService {
    long getFirstAvailableCode(Class<? extends NumericCodedEntity> codeEntity);
    long getFirstAvailableCode(Class<? extends NumericCodedEntity> codeEntity, Query query);
}
