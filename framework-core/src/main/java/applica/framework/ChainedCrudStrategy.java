package applica.framework;

/**
 * Created by bimbobruno on 23/10/15.
 */
public abstract class ChainedCrudStrategy implements CrudStrategy {

    private CrudStrategy parent;

    public CrudStrategy getParent() {
        return parent;
    }

    public void setParent(CrudStrategy parent) {
        this.parent = parent;
    }

    public ChainedCrudStrategy(CrudStrategy parent) {
        this.parent = parent;
    }

    public ChainedCrudStrategy() {
    }

    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        if (parent != null) {
            return parent.get(id, repository);
        }

        return null;
    }

    @Override
    public <T extends Entity> LoadResponse<T> find(LoadRequest loadRequest, Repository<T> repository) {
        if (parent != null) {
            return parent.find(loadRequest, repository);
        }

        return null;
    }

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        if (parent != null) {
            parent.save(entity, repository);
        }
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        if (parent != null) {
            parent.delete(id, repository);
        }
    }
}
