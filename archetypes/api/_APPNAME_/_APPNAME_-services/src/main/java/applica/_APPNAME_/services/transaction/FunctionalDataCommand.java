package applica._APPNAME_.services.transaction;

public class FunctionalDataCommand<T> implements Command {

    @FunctionalInterface
    public interface FunctionalCommandAction<T> {
        void execute(T data) throws Exception;
    }

    private FunctionalCommandAction<T> executeCommand;
    private FunctionalCommandAction<T> rollbackCommand;
    private T data;


    public FunctionalDataCommand(FunctionalCommandAction<T> executeCommand, FunctionalCommandAction<T> rollbackCommand, T data) {
        this.executeCommand = executeCommand;
        this.rollbackCommand = rollbackCommand;
        this.data = data;
    }

    @Override
    public void execute() throws Exception {
        this.executeCommand.execute(this.data);
    }

    @Override
    public void rollback() throws Exception {
        this.rollbackCommand.execute(this.data);
    }

    public static <T> FunctionalDataCommand create(FunctionalCommandAction<T> execute, FunctionalCommandAction<T> rollback, T data) {
        return new FunctionalDataCommand<T>(execute, rollback, data);
    }

}
