package applica._APPNAME_.api.operations;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.responses.ResponseCode;
import applica.framework.Entity;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import applica.framework.library.responses.Response;
import applica.framework.widgets.operations.BaseGetOperation;
import applica.framework.widgets.operations.GetOperation;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class UserGetOperation extends BaseGetOperation {

    @Override
    protected void finishNode(Entity entity, ObjectNode node) {
        map().imageToDataUrl(entity, node, "image", "_image", "150x*");
        map().imageToDataUrl(entity, node, "coverImage", "_cover", "150x*");
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }


}
