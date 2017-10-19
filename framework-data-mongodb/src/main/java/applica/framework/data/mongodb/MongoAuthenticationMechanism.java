package applica.framework.data.mongodb;

/**
 * Created by antoniolovicario on 24/10/16.
 */
public enum MongoAuthenticationMechanism {
    SCRAM_SHA_1("SCRAM-SHA-1");

    private String description;

    MongoAuthenticationMechanism(String s) {
        this.description = s;
    }

    public String getDescription() {
        return description;
    }


}
