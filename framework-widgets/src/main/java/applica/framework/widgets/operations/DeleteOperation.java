package applica.framework.widgets.operations;

import applica.framework.widgets.CrudConfigurationException;
import applica.framework.Entity;
import applica.framework.Repository;

public class DeleteOperation {
    private Repository repository;

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public void delete(String id) throws CrudConfigurationException {
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        repository.delete(id);
    }

    public void delete(String[] ids) throws CrudConfigurationException {
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        Entity e = new Entity() {
            @Override
            public Object getId() {
                return null;  //To change body of implemented methods use File | Settings | File Templates.
            }

            @Override
            public void setId(Object id) {
                //To change body of implemented methods use File | Settings | File Templates.
            }
        };

        e.setId(10);

        for (String id : ids) {
            repository.delete(id);
        }
    }
}
