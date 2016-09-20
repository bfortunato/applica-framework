package applica._APPNAME_.admin.data;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.LoadRequest;
import applica.framework.LoadResponse;
import applica.framework.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.util.StringUtils;

import java.util.Optional;

/**
 * Created by bimbobruno on 17/03/15.
 */
@org.springframework.stereotype.Repository
public class UsersRepositoryWrapper implements Repository<User> {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Optional<User> get(Object id) {
        Optional<User> user = usersRepository.get(id);
        //remove password for edit form
        user.ifPresent(u -> u.setPassword(""));
        return user;
    }

    @Override
    public LoadResponse<User> find(LoadRequest request) {
        return usersRepository.find(request);
    }

    @Override
    public void save(User entity) {
        if (StringUtils.hasLength(entity.getPassword())) {
            String encodedPassword = new Md5PasswordEncoder().encodePassword(entity.getPassword(), null);
            entity.setPassword(encodedPassword);
        } else if (entity.getId() != null) {
            User persistentUser = usersRepository.get(entity.getId()).orElseThrow(() -> new RuntimeException("Could not load user to set password"));
            entity.setPassword(persistentUser.getPassword());
        }
        usersRepository.save(entity);
    }

    @Override
    public void delete(Object id) {
        usersRepository.delete(id);
    }

    @Override
    public Class<User> getEntityType() {
        return usersRepository.getEntityType();
    }
}
