package applica.framework.security;

import applica.framework.Query;

public interface NumericCodedEntity extends CodedEntity {
    long getCode();

    void setCode(long code);

    Query generateQueryForCodeProgressive();
}
