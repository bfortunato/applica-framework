package applica._APPNAME_.services.transaction;

public interface Command {

    void execute() throws Exception;
    void rollback() throws Exception;
}
