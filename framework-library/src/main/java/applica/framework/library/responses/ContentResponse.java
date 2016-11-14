package applica.framework.library.responses;


public class ContentResponse extends Response {
    private String content;

    public ContentResponse() {
        super(Response.OK);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
