package applica.framework;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by applica on 10/28/15.
 */
public class Conjunction extends Filter {

    public Conjunction() {
        setType(Filter.AND);
        setValue(new ArrayList<Filter>());
    }

    public List<Filter> getChildren() {
        return (List<Filter>) getValue();
    }

    public void setChildren(List<Filter> children) {
        setValue(children);
    }

}
