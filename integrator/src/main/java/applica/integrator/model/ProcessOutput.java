package applica.integrator.model;

import java.util.ArrayList;
import java.util.List;

public class ProcessOutput {

    private List<String> out = new ArrayList<>();
    private List<String> err = new ArrayList<>();
    private int exitCode;

    public void putOut(String line) {
        out.add(line);
    }

    public void putErr(String line) {
        err.add(line);
    }

    public List<String> getOut() {
        return out;
    }

    public void setOut(List<String> out) {
        this.out = out;
    }

    public List<String> getErr() {
        return err;
    }

    public void setErr(List<String> err) {
        this.err = err;
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }

    public int getExitCode() {
        return exitCode;
    }
}
