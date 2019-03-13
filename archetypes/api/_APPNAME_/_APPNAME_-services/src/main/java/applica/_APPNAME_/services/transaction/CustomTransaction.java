package applica._APPNAME_.services.transaction;

public abstract class CustomTransaction {

    public abstract CustomTransaction add(Command command);

    public abstract void execute() throws TransactionException;

    public static CustomTransaction create() {
        return new CustomTransactionImpl();
    }

}
