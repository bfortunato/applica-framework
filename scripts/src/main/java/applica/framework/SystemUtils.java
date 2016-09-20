package applica.framework;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 18:08
 */
public class SystemUtils {

    public static String multiplatformPath(String path) {
        return path.replace("/", File.separator);
    }

    public static boolean confirm(String message) {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.print(String.format("%s [y,n]: ", message));
        try {
            String s = br.readLine();
            if (s.toLowerCase().equals("y")) {
                return true;
            } else if (s.toLowerCase().equals("n")) {
                return false;
            } else {
                System.out.println("Please answer 'y' or 'n'");
                return confirm(message);
            }
        } catch (IOException e) {
            return false;
        }
    }

}
