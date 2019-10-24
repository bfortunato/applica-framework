package applica.framework.notifications;

import applica.framework.AEntity;
import applica.framework.library.dynaobject.BaseDynamicObject;
import applica.framework.library.dynaobject.DynamicObject;

import java.util.Date;

public class Notification extends AEntity {

    private Date date;
    private String title;
    private String body;
    private BaseDynamicObject data = new BaseDynamicObject();

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
