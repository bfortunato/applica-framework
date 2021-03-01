package applica.framework.notifications;

import applica.framework.AEntity;

import java.util.ArrayList;
import java.util.List;

public class Inbox extends AEntity {

    private Object userId;
    private List<Object> notificationIds = new ArrayList<>();
    private List<Object> readNotificationIds = new ArrayList<>();

    public Object getUserId() {
        return userId;
    }

    public void setUserId(Object userId) {
        this.userId = userId;
    }

    public List<Object> getNotificationIds() {
        return notificationIds;
    }

    public void setNotificationIds(List<Object> notificationIds) {
        this.notificationIds = notificationIds;
    }

    public List<Object> getReadNotificationIds() {
        return readNotificationIds;
    }

    public void setReadNotificationIds(List<Object> readNotificationIds) {
        this.readNotificationIds = readNotificationIds;
    }

    public void markAsRead(Object notificationId) {
        notificationIds.removeIf(n -> n.equals(notificationId));
        readNotificationIds.add(notificationId);
    }

    public void addNotification(Object notificationId) {
        notificationIds.add(notificationId);
    }
}
