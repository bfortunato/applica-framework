package applica.framework.security;


public interface CodeGeneratorService {
    long getFirstAvailableCode(Class<? extends NumericCodedEntity> codeEntity);
}
