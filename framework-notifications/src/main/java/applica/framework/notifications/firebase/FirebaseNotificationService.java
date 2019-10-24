package applica.framework.notifications.firebase;

import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.library.options.OptionsManager;
import applica.framework.notifications.*;
import applica.framework.notifications.Notification;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class FirebaseNotificationService implements NotificationService, InitializingBean, DisposableBean {

    private Log logger = LogFactory.getLog(getClass());

    private final OptionsManager options;
    private final ResourceLoader resourceLoader;

    @Autowired
    public FirebaseNotificationService(OptionsManager options, ResourceLoader resourceLoader) {
        this.options = options;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        var resource = resourceLoader.getResource("classpath:/firebase-messaging.json");
        if (!resource.exists()) {
            throw new Exception("firebase-messaging.json for credentials not present");
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build();

        FirebaseApp.initializeApp(options);
    }

    @Override
    public void destroy() throws Exception {

    }

    @Override
    public void setToken(Object userId, String token) {
        var userToken = Repo.of(UserToken.class).find(Query.build().eq("userId", userId)).findFirst().orElse(null);
        if (userToken == null) {
            userToken = new UserToken();
            userToken.setUserId(userId);
        }

        userToken.setToken(token);
        userToken.setTokenLastUpdate(new Date());

        Repo.of(UserToken.class).save(userToken);
    }

    @Override
    public String getToken(Object userId) {
        return Repo.of(UserToken.class).find(Query.build().eq("userId", userId)).findFirst().map(UserToken::getToken).orElse(null);
    }

    @Override
    public void notify(Notification notification, List<Object> recipients) throws MessagingException {
        MulticastMessage.Builder message = MulticastMessage.builder();
        message.setNotification(toFirebase(notification));

        notification.getData().getProperties().forEach(p -> message.putData(p.getKey(), p.getValue() != null ? p.getValue().toString() : null));

        for (Object userId : recipients) {
            String token = getToken(userId);
            if (token != null) {
                message.addToken(token);
            }
        }

        BatchResponse response = null;
        try {
            response = FirebaseMessaging.getInstance().sendMulticast(message.build());
        } catch (FirebaseMessagingException e) {
            throw new MessagingException(e);
        }

        logger.info(String.format("Notification successfully sent to %d recipients. %d failures", response.getSuccessCount(), response.getFailureCount()));
        response.getResponses().forEach(r -> logger.info(r.getMessageId()));

        Repo.of(Notification.class).save(notification);
    }

    private com.google.firebase.messaging.Notification toFirebase(Notification notification) {
        return new com.google.firebase.messaging.Notification(notification.getTitle(), notification.getBody());
    }

    @Override
    public void notify(Notification notification, Object recipient) throws MessagingException {
        notify(notification, Collections.singletonList(recipient));
    }

    @Override
    public void markAsRead(Object userId, Object notificationId) {
        var inbox = getInbox(userId);
        inbox.markAsRead(notificationId);

        Repo.of(Inbox.class).save(inbox);
    }

    @Override
    public List<Notification> findUnreadNotifications(Object userId, long page, long rowsPerPage) {
        var inbox = getInbox(userId);

        return inbox
                .getNotificationIds()
                .stream()
                .filter(i -> inbox.getReadNotificationIds().stream().noneMatch(r -> r.equals(i)))
                .map(i -> Repo.of(Notification.class).get(i))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .skip((page - 1) * rowsPerPage)
                .limit(rowsPerPage)
                .collect(Collectors.toList());
    }

    private Inbox getInbox(Object userId) {
        var inbox = Repo.of(Inbox.class).find(Query.build().eq("userId", userId)).findFirst().orElse(null);
        if (inbox == null) {
            inbox = new Inbox();
            inbox.setUserId(userId);

            Repo.of(Inbox.class).save(inbox);
        }

        return inbox;
    }

}
