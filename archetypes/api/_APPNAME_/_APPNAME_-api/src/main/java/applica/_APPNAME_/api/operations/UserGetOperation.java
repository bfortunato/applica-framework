package applica._APPNAME_.api.operations;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.Entity;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
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
public class UserGetOperation implements GetOperation {

    @Autowired
    private FileServer fileServer;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public ObjectNode get(Object id) throws OperationException {
        try {
            User user = usersRepository.get(id).orElseThrow(() -> new OperationException("User not found: " + id));

            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            ObjectNode node = entitySerializer.serialize(user);

            if (StringUtils.isNotEmpty(user.getImage())) {
                InputStream in = fileServer.getImage(user.getImage(), "250x*");
                URLData urlData = new URLData(String.format("image/%s", FilenameUtils.getExtension(user.getImage())), in);
                node.put("_image", urlData.write());
            }

            if (StringUtils.isNotEmpty(user.getCoverImage())) {
                InputStream in = fileServer.getImage(user.getCoverImage(), "250x*");
                URLData urlData = new URLData(String.format("image/%s", FilenameUtils.getExtension(user.getCoverImage())), in);
                node.put("_cover", urlData.write());
            }

            return node;
        } catch (Exception e) {
            throw new OperationException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }


}
