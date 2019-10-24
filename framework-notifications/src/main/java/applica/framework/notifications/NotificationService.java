package applica.framework.notifications;

import java.util.List;

public interface NotificationService {

    void setToken(Object userId, String token);
    String getToken(Object userId);
    void notify(Notification notification, List<Object> recipients) throws MessagingException;
    void notify(Notification notification, Object recipient) throws MessagingException;
    void markAsRead(Object userId, Object notificationId);
    List<Notification> findUnreadNotifications(Object userId, long page, long rowsPerPage);

}
