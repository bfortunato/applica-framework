package applica._APPNAME_.services.transaction;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class CustomTransactionImpl extends CustomTransaction {

    private List<Command> commands = new ArrayList<>();
    private List<Command> executedCommands =  new ArrayList<>();

    @Override
    public CustomTransaction add(Command command) {
        this.commands.add(command);
        return this;
    }

    @Override
    public void execute() throws TransactionException {
        executedCommands.clear();

        for (Command c : this.commands) {
            try {
                executedCommands.add(c);
                c.execute();
            } catch (Exception e) {
                e.printStackTrace();
                rollbackAll();
                throw new TransactionException(String.format("Transaction execute error: %s", e.getMessage()), e);
            }
        }
    }

    private void rollbackAll() throws TransactionException {
        Collections.reverse(this.executedCommands);

        for (Command c : this.executedCommands) {
            try {
                c.rollback();
            } catch (Exception e) {
                e.printStackTrace();
                throw new TransactionException(String.format("Transaction rollback error: %s", e.getMessage()), e);
            }
        }
    }

}
