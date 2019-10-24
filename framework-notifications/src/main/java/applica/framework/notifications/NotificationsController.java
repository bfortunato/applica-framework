package applica.framework.notifications;

import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import applica.framework.security.AuthenticationException;
import applica.framework.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationsController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationsController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/token")
    public Response setToken(String token) {
        try {
            notificationService.setToken(SecurityUtils.getLoggedUserId(), token);

            return Response.ok();
        } catch (AuthenticationException e) {
            return new Response(Response.UNAUTHORIZED);
        }
    }

    @PostMapping("/test")
    public Response test(String title, String body) {
        try {
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setBody(body);

            notificationService.notify(notification, SecurityUtils.getLoggedUserId());

            return Response.ok();
        } catch (AuthenticationException e) {
            return new Response(Response.UNAUTHORIZED);
        } catch (MessagingException e) {
            e.printStackTrace();
            return new Response(Response.ERROR, e.getMessage());
        }
    }

    public Response markAsRead(Object notificationId) {
        try {
            notificationService.markAsRead(SecurityUtils.getLoggedUserId(), notificationId);

            return Response.ok();
        } catch (AuthenticationException e) {
            return new Response(Response.UNAUTHORIZED);
        }
    }

    public Response findUnreadNotifications(long page, long rowsPerPage) {
        try {
            return new ValueResponse(notificationService.findUnreadNotifications(SecurityUtils.getLoggedUserId(), page, rowsPerPage));
        } catch (AuthenticationException e) {
            return new Response(Response.UNAUTHORIZED);
        }
    }

}
