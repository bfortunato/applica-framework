package applica.framework.data.security;

import applica.framework.*;
import org.springframework.util.Assert;

import java.util.Optional;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class SecureCrudStrategy extends ChainedCrudStrategy {

    private OwnerProvider ownerProvider;

    private String ownerPropertyName = "ownerId";

    public String getOwnerPropertyName() {
        return ownerPropertyName;
    }

    public void setOwnerPropertyName(String ownerPropertyName) {
        this.ownerPropertyName = ownerPropertyName;
    }

    public OwnerProvider getOwnerProvider() {
        return ownerProvider;
    }

    public void setOwnerProvider(OwnerProvider ownerProvider) {
        this.ownerProvider = ownerProvider;
    }

    private Object getOwnerId() {
        if (ownerProvider == null) {
            ownerProvider = new LoggedUserIdOwnerProvider();
        }

        return ownerProvider.provide();
    }

    private void checkAttributes() {
        Assert.notNull(getParent(), "Parent strategy not found. Check application configuration file");
        Assert.notNull(ownerPropertyName, "Parent strategy not found. Check application configuration file");
    }

    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType())) {
            Optional<T> entity = super.find(LoadRequest.build().eq(getOwnerPropertyName(), getOwnerId()).id(id), repository).findFirst();
            return entity.orElse(null);
        } else {
            return super.get(id, repository);
        }
    }

    @Override
    public <T extends Entity> LoadResponse<T> find(LoadRequest loadRequest, Repository<T> repository) {
        checkAttributes();

        if (SecureEntity.class.isAssignableFrom(repository.getEntityType())) {
            Filter filter = new Filter(getOwnerPropertyName(), getOwnerId());
            loadRequest.getFilters().add(filter);
        }

        return super.find(loadRequest, repository);
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
