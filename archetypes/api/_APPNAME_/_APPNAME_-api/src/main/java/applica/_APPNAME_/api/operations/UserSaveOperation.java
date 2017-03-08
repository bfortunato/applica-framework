package applica._APPNAME_.api.operations;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.responses.ResponseCode;
import applica.framework.Entity;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.InvalidDataException;
import applica.framework.library.base64.URLData;
import applica.framework.library.responses.Response;
import applica.framework.widgets.operations.BaseSaveOperation;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.operations.SaveOperation;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class UserSaveOperation extends BaseSaveOperation {

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }

    @Override
    protected void finishEntity(ObjectNode node, Entity entity) {
        map().dataUrlToImage(node, entity, "_image", "image", "images/users");
        map().dataUrlToImage(node, entity, "_cover", "coverImage", "images/covers");
    }

}
