package applica.framework.data;

import applica.framework.Entity;
import applica.framework.Filter;
import applica.framework.Query;
import applica.framework.utils.TypeUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 16/02/2017.
 */
public class KeywordQueryBuilder {

    Class<? extends Entity> type;

    public KeywordQueryBuilder(Class<? extends Entity> type) {
        this.type = type;
    }

    public void build(Query query) {
        List<String> keywordProperties = new ArrayList<>();

        for (Field field : TypeUtils.getAllFields(type)) {
            Keyword keyword = field.getAnnotation(Keyword.class);
            if (keyword != null) {
                keywordProperties.add(field.getName());
            }
        }

        if (keywordProperties.size() > 0) {
            if (keywordProperties.size() == 1) {
                query.getFilters().add(new Filter(keywordProperties.get(0), query.getKeyword(), Filter.LIKE));
            } else {
                List<Filter> ors = new ArrayList<>();
                for (String kp : keywordProperties) {
                    ors.add(new Filter(kp, query.getKeyword(), Filter.LIKE));
                }

                query.getFilters().add(new Filter("", ors, Filter.OR));
            }
        }
    }
}
