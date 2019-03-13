package applica._APPNAME_.services.impl;

import applica._APPNAME_.data.mongodb.utils.RepositoryUtils;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.UserService;
import applica.framework.*;
import applica.framework.security.Security;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public Result<User> getUserByPermission(List<String> permissions, Query query) {

        if (query == null)
            query = Query.build();

        List<Role> roles = Repo.of(Role.class).find(Query.build().in("permissions", permissions)).getRows();
        if (roles.size() > 0) {
            query.getFilters().add(new Filter(Filters.USER_ROLES_ID,roles.stream().map(AEntity::getSid).collect(Collectors.toList()), Filter.IN));
            return Repo.of(User.class).find(query);
        }
        return null;
    }

    @Override
    public List<User> findUsers(Query query) {
        return Repo.of(User.class).find(query).getRows();
    }

    @Override
    public User getUser(String userId) {
        return Repo.of(User.class).get(userId).orElse(null);
    }

    @Override
    public List<User> getUserByIds(List<String> userIds) {
        return Repo.of(User.class).find(Query.build().in(Filters.REPOSITORY_ID, RepositoryUtils.getRepositoryIdFromIds(userIds))).getRows();
    }

    @Override
    public List<User> getUserByMails(List<String> mails) {
        return Repo.of(User.class).find(Query.build().in(Filters.USER_MAIL, mails)).getRows();
    }

    @Override
    public User getUserThatCanBeLoggedId(String userId) {
        return ((User) Security.withMe().getLoggedUser()).getSid().equals(userId) ? (User) Security.withMe().getLoggedUser() : Repo.of(User.class).get(userId).orElse(null);

    }
}
