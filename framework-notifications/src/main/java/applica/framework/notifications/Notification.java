package applica.framework.notifications;

import applica.framework.AEntity;
import applica.framework.library.dynaobject.BaseDynamicObject;

import java.util.Date;

public class Notification extends AEntity {

    private Object senderId;
    private Date date;
    private String title;
    private String body;
    private BaseDynamicObject data = new BaseDynamicObject();

    public Object getSenderId() {
        return senderId;
    }

    public void setSenderId(Object senderId) {
        this.senderId = senderId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public BaseDynamicObject getData() {
        return data;
    }

    public void setData(BaseDynamicObject data) {
        this.data = data;
    }
}
