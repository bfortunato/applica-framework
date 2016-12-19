package applica.framework.widgets.operations;

import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;

import java.util.List;

public class DeleteOperation {
    private Repository repository;

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public void delete(String id) {
        if (repository == null) throw new ProgramException("Missing repository");

        repository.delete(id);
    }

    public void delete(List<String> ids) {
        if (repository == null) throw new ProgramException("Missing repository");

        for (String id : ids) {
            repository.delete(id);
        }
    }
}
