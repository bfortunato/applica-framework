package applica.integrator.model;

public class RepositoryNotInitializedException extends Exception {

    private final Deployment deployment;

    public RepositoryNotInitializedException(Deployment deployment) {
        this.deployment = deployment;
    }

    public Deployment getDeployment() {
        return deployment;
    }
}
