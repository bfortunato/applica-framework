package applica.framework;

/**
 * The base object for all framework components
 */
public interface Entity extends Persistable {
    Object getId();
    void setId(Object id);
}
