package applica.framework.security.token;

public class TokenExpirationTime {


    public static final long DURATION_IN_MILLIS = 60L * 60L * 24L * 30L * 1000L; //un mese circa

    public static final long DURATION_IN_SECONDS = DURATION_IN_MILLIS / 1000;
}
