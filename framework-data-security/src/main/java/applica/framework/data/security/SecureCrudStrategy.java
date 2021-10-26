package applica.framework.data.security;

import applica.framework.*;
import applica.framework.data.security.LoggedUserIdOwnerProvider;
import applica.framework.data.security.OwnerProvider;
import applica.framework.data.security.SecureCrudStrategy;
import applica.framework.data.security.SecureEntity;
import applica.framework.library.utils.SystemOptionsUtils;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;

import java.util.Objects;
import java.util.Optional;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class SecureCrudStrategy extends ChainedCrudStrategy {

    private static final ThreadLocal<OwnerProvider> ownerProvider = ThreadLocal.withInitial(() -> null);

    private static final ThreadLocal<Boolean> disableSecureStrategy = ThreadLocal.withInitial(() -> false);

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
        Query q =  Query.build().id(id);

        manageOwnerPropertyFilter(q, repository);

        Optional<T> entity = super.find(q, repository).findFirst();
        return entity.orElse(null);
    }

    public <T extends Entity> boolean isCrossOrganizationEntity(Repository<T> repository) {
        return false;
    }

    @Override
    public <T extends Entity> Result<T> find(Query query, Repository<T> repository) {
        checkAttributes();


        manageOwnerPropertyFilter(query, repository);

        return super.find(query, repository);
    }

    private <T extends Entity> void manageOwnerPropertyFilter(Query query, Repository<T> repository) {
        if (SecureEntity.class.isAssignableFrom(repository.getEntityType()) && isSecureStrategyEnabled()) {

            Object ownerId = getOwnerId();

            Disjunction disjunction = new Disjunction();
            disjunction.setProperty(getOwnerPropertyName());
            if (ownerId == null || isCrossOrganizationEntity(repository)) {
                disjunction.getChildren().add(new Filter(getOwnerPropertyName(), false, Filter.EXISTS));
            } else {

            }
            disjunction.getChildren().add(new Filter(getOwnerPropertyName(), ownerId));
            query.getFilters().add(disjunction);
        }
    }

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType()) && isSecureStrategyEnabled()) {
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


        boolean canDelete = true;

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType()) && isSecureStrategyEnabled()) {
            Entity entity = get(id, repository);
            canDelete = Objects.equals(((SecureEntity) entity).getOwnerId(), getOwnerId());
        }

        if (canDelete) {
            super.delete(id, repository);
        }

    }

    public boolean isSecureStrategyEnabled() {
        return !disableSecureStrategy.get();
    }

    public void disableSecureStrategy() {
        disableSecureStrategy.set(true);
    }

    public void enableSecureStrategy() {
        disableSecureStrategy.set(false);
    }


    @Override
    public <T extends Entity> void deleteMany(Query query, Repository<T> repository) {
        manageOwnerPropertyFilter(query, repository);
        super.deleteMany(query, repository);
    }
}
