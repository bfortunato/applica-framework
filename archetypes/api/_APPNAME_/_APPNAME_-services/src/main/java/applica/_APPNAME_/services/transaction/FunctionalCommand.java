package applica._APPNAME_.services.transaction;

public class FunctionalCommand implements Command {

    @FunctionalInterface
    public interface FunctionalCommandAction<T> {
        void execute() throws Exception;
    }

    private FunctionalCommandAction executeCommand;
    private FunctionalCommandAction rollbackCommand;


    public FunctionalCommand(FunctionalCommandAction executeCommand, FunctionalCommandAction rollbackCommand) {
        this.executeCommand = executeCommand;
        this.rollbackCommand = rollbackCommand;
    }

    @Override
    public void execute() throws Exception {
        if (this.executeCommand != null) {
            this.executeCommand.execute();
        }
    }

    @Override
    public void rollback() throws Exception {
        if (this.rollbackCommand != null) {
            this.rollbackCommand.execute();
        }
    }

    public static FunctionalCommand create(FunctionalCommandAction execute, FunctionalCommandAction rollback) {
        return new FunctionalCommand(execute, rollback);
    }

}
