package applica.framework;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 13/10/14
 * Time: 09:24
 */

/**
 * Represents a disjunction in requests. Well known as OR in databases
 */
public class Disjunction extends Filter {

    public Disjunction() {
        setType(Filter.OR);
        setValue(new ArrayList<Filter>());
    }

    public List<Filter> getChildren() {
        return (List<Filter>) getValue();
    }

    public void setChildren(List<Filter> children) {
        setValue(children);
    }

}
