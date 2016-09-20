package applica.framework.builders;

import applica.framework.Filter;

/**
 * Created by applica on 10/28/15.
 */
public class ConjunctionBuilder extends CriteriaBuilder {

    public ConjunctionBuilder(LoadRequestBuilder loadRequestBuilder) {
        super(Filter.AND, loadRequestBuilder, null);
    }

    public ConjunctionBuilder(LoadRequestBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        super(Filter.AND, loadRequestBuilder, parentBuilder);
    }

    public static ConjunctionBuilder begin(LoadRequestBuilder loadRequestBuilder) {
        return new ConjunctionBuilder(loadRequestBuilder);
    }

    public static ConjunctionBuilder begin(LoadRequestBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        return new ConjunctionBuilder(loadRequestBuilder, parentBuilder);
    }

}
