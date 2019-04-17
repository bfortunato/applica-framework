package applica.framework.data.security;

import applica.framework.*;
import org.springframework.util.Assert;

import java.util.Optional;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class SecureCrudStrategy extends ChainedCrudStrategy {

    private static final ThreadLocal<OwnerProvider> ownerProvider = ThreadLocal.withInitial(() -> null);

    private String ownerPropertyName = "ownerId";

    public SecureCrudStrategy(CrudStrategy parent) {
        super(parent);
    }

    public SecureCrudStrategy() {
    }

    public String getOwnerPropertyName() {
        return ownerPropertyName;
    }

    public void setOwnerPropertyName(String ownerPropertyName) {
        this.ownerPropertyName = ownerPropertyName;
    }

    public OwnerProvider getOwnerProvider() {
        return ownerProvider.get();
    }

    public void setOwnerProvider(OwnerProvider ownerProvider) {
        this.ownerProvider.set(ownerProvider);
    }

    private Object getOwnerId() {
        if (ownerProvider.get() == null) {
            ownerProvider.set(new LoggedUserIdOwnerProvider());
        }

        return ownerProvider.get().provide();
    }

    private void checkAttributes() {
        Assert.notNull(getParent(), "Parent strategy not found. Check application configuration file");
        Assert.notNull(ownerPropertyName, "Parent strategy not found. Check application configuration file");
    }

    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType())) {
            Optional<T> entity = super.find(Query.build().eq(getOwnerPropertyName(), getOwnerId()).id(id), repository).findFirst();
            return entity.orElse(null);
        } else {
            return super.get(id, repository);
        }
    }

    @Override
    public <T extends Entity> Result<T> find(Query query, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType())) {
            Filter filter = new Filter(getOwnerPropertyName(), getOwnerId());
            query.getFilters().add(filter);
        }

        return super.find(query, repository);
    }

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType())) {
            SecureEntity se = (SecureEntity) entity;

            if (se.getOwnerId() == null) {
                se.setOwnerId(getOwnerId());
            }
        }

        super.save(entity, repository);
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        checkAttributes();

        super.delete(id, repository);
    }
}
