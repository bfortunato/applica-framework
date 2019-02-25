package applica._APPNAME_.domain.model;

public class SystemInformation {
    private String apiVersion;

    public SystemInformation(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public SystemInformation() {
    }



    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }
}
