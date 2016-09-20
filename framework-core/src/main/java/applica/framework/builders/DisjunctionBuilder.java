package applica.framework.builders;

import applica.framework.Filter;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 13/10/14
 * Time: 09:48
 */
public class DisjunctionBuilder extends CriteriaBuilder {

    public DisjunctionBuilder(LoadRequestBuilder loadRequestBuilder) {
        super(Filter.OR, loadRequestBuilder, null);
    }

    public DisjunctionBuilder(LoadRequestBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        super(Filter.OR, loadRequestBuilder, parentBuilder);
    }

    public static DisjunctionBuilder begin(LoadRequestBuilder loadRequestBuilder) {
        return new DisjunctionBuilder(loadRequestBuilder);
    }

    public static DisjunctionBuilder begin(LoadRequestBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        return new DisjunctionBuilder(loadRequestBuilder, parentBuilder);
    }

}
