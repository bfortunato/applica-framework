package applica.integrator.model;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ProcessUtils {

    ProcessOutput exec(String... arguments) throws IOException, InterruptedException {
        ProcessOutput output = new ProcessOutput();

        Process process = new ProcessBuilder(arguments).start();
        process.waitFor();

        BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = outputReader.readLine()) != null) {
            output.putOut(line);
        }
        outputReader.close();

        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((line = errorReader.readLine()) != null) {
            output.putErr(line);
        }
        errorReader.close();

        output.setExitCode(process.exitValue());

        return output;
    }

}
