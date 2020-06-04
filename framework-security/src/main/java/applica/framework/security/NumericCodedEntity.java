package applica.framework.security;

public interface NumericCodedEntity extends CodedEntity {
    long getCode();

    void setCode(long code);
}
