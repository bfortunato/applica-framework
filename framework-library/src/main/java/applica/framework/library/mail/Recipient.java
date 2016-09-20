package applica.framework.library.mail;

/**
 * Created by federicomalvasi on 09/03/15.
 */


public class Recipient {

    public static final int TYPE_TO = 0;
    public static final int TYPE_CC = 1;
    public static final int TYPE_CCN = 2;

    private String recipient;
    private int recipientType;

    public Recipient(String recipient, int recipientType){
        this.recipient = recipient;
        this.recipientType = recipientType;
    }

    public Recipient(){}

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public int getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(int recipientType) {
        this.recipientType = recipientType;
    }
}
