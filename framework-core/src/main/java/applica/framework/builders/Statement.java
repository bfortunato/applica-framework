package applica.framework.builders;

import applica.framework.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class Statement<T extends Entity> {

    private Query query = new Query();
    private Repository<T> repository;
    private Result<T> result;

    public Statement(Repository<T> repository, Filter[] filters) {
        this.repository = repository;
        query.setFilters(Arrays.asList(filters));
    }

    public Statement<T> keyword(String keyword) {
        query.setKeyword(keyword);
        return this;
    }

    public Statement<T> sort(Sort... sorts) {
        query.getSorts().addAll(Arrays.asList(sorts));
        return this;
    }

    public Statement<T> projection(Projection... projections) {
        query.getProjections().addAll(Arrays.asList(projections));
        return this;
    }

    public Result<T> execute() {
        return repository.find(query);
    }

    public long count() { return repository.count(query); }

    public List<T> getRows() {
        if (this.result == null) {
            this.result = execute();
        }

        return result.getRows();
    }

    public Optional<T> findFirst() {
        if (this.result == null) {
            this.result = execute();
        }

        return result.findFirst();
    }

    public long getTotalRows() {
        if (this.result == null) {
            this.result = execute();
        }

        return result.getTotalRows();
    }

    public <R extends Entity> Result<R> map(Function<T, R> mapper) {
        if (this.result == null) {
            this.result = execute();
        }

        return result.map(mapper);
    }
}
