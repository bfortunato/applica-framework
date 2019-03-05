package applica._APPNAME_.api.operations;

import applica._APPNAME_.api.facade.AccountFacade;
import applica._APPNAME_.domain.model.User;
import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.widgets.operations.BaseSaveOperation;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class UserSaveOperation extends BaseSaveOperation {

    @Autowired
    private AccountFacade accountFacade;

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }

    @Override
    protected void finishEntity(ObjectNode node, Entity entity) {
        map().dataUrlToImage(node, entity, "_image", "image", "images/users");
        map().dataUrlToImage(node, entity, "_cover", "coverImage", "images/covers");
    }

    @Override
    protected void beforeSave(ObjectNode data, Entity entity) {
        String passwordToSave = null;
        if (org.springframework.util.StringUtils.hasLength(data.get("password").asText())) {
            //set / modifica password
            passwordToSave = accountFacade.encryptAndGetPassword(data.get("password").asText());
            ((User) entity).setCurrentPasswordSetDate(new Date());
        } else {
            if (entity.getId() != null) {
                User previous = Repo.of(User.class).get(((User) entity).getSid()).get();
                passwordToSave = ((User) previous).getPassword();
            }
        }
        ((User) entity).setPassword(passwordToSave);
        ((User) entity).setMail(((User) entity).getMail());

    }

    @Override
    protected void afterSave(ObjectNode node, Entity entity) {
        // Ottengo tutte le info necessarie ad aggiornare/creare un utente
        User user = (User) entity;

        if (user.isActive()) {
            boolean needToActivate = false;

            // Se nuovo utente autogenero password temporanea
            if (node.get("id") == null) {
                needToActivate = true;
                user.setFirstLogin(true);
                user.setRegistrationDate(new Date());

                String tempPassword = user.getSid();
                user.setPassword(accountFacade.encryptAndGetPassword(tempPassword));
            }

            Repo.of(User.class).save(user);

            if (needToActivate) {
                new Thread(() -> accountFacade.sendRegistrationMail(user, user.getSid())).start();
            }
        }

    }
}
