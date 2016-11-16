package applica.framework.builders;

import applica.framework.Filter;

/**
 * Created by applica on 10/28/15.
 */
public class ConjunctionBuilder extends CriteriaBuilder {

    public ConjunctionBuilder(QueryBuilder loadRequestBuilder) {
        super(Filter.AND, loadRequestBuilder, null);
    }

    public ConjunctionBuilder(QueryBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        super(Filter.AND, loadRequestBuilder, parentBuilder);
    }

    public static ConjunctionBuilder begin(QueryBuilder loadRequestBuilder) {
        return new ConjunctionBuilder(loadRequestBuilder);
    }

    public static ConjunctionBuilder begin(QueryBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        return new ConjunctionBuilder(loadRequestBuilder, parentBuilder);
    }

}
