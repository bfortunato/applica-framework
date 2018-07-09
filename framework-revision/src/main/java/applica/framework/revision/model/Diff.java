package applica.framework.revision.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by bimbobruno on 21/02/2017.
 */
public class Diff {

    public boolean hasChanges() {
        return changes.stream().anyMatch(c -> !c.action.equals(Action.unchanged));
    }

    @FunctionalInterface
    public interface Comparator {
        boolean compare(Object o1, Object o2);
    }

    public List<Object> getDeleted() {
        return changes.stream().filter(c -> c.action == Action.deleted).map(Change::getValue).collect(Collectors.toList());
    }

    public List<Object> getAdded() {
        return changes.stream().filter(c -> c.action == Action.added).map(Change::getValue).collect(Collectors.toList());
    }

    public static  Diff compute(List sourceList, List mergeList, Comparator comparator) {
        Diff result = new Diff();
        for (Object o1 : sourceList) {
            if (mergeList.stream().anyMatch(o2 -> comparator.compare(o1, o2))) {
                result.addChange(o1, Diff.Action.unchanged);
            } else {
                result.addChange(o1, Diff.Action.deleted);
            }
        }

        for (Object o1 : mergeList) {
            if (!sourceList.stream().anyMatch(o2 -> comparator.compare(o1, o2))) {
                result.addChange(o1, Diff.Action.added);
            }
        }

        return result;
    }

    public enum Action {
        unchanged,
        deleted,
        added
    }

    public class Change {
        private Object value;
        private Action action = Action.unchanged;

        public Change(Object value, Action action) {
            this.value = value;
            this.action = action;
        }

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }

        public Action getAction() {
            return action;
        }

        public void setAction(Action action) {
            this.action = action;
        }
    }

    private List<Change> changes = new ArrayList<>();

    public void addChange(Object value, Action action) {
        changes.add(new Change(value, action));
    }



}
