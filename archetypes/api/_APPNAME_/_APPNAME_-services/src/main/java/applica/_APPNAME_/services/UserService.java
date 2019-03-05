package applica._APPNAME_.services;

import applica._APPNAME_.domain.model.User;
import applica.framework.Query;
import applica.framework.Result;

import java.util.List;

public interface UserService {
    Result<User> getUserByPermission(List<String> permissions, Query query);

    List<User> findUsers(Query query);

    User getUser(String userId);

    List<User> getUserByIds(List<String> userIds);

    List<User> getUserByMails(List<String> mails);

    User getUserThatCanBeLoggedId(String authorId);
}
