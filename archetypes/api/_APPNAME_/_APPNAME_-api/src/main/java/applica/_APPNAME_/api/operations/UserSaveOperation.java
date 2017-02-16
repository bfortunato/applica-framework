package applica._APPNAME_.api.operations;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.Entity;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.operations.SaveOperation;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class UserSaveOperation implements SaveOperation{

    @Autowired
    private FileServer fileServer;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }

    @Override
    public void save(ObjectNode data) throws OperationException {
        try {
            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            User user = ((User) entitySerializer.deserialize(data));

            String imageData = null;
            if (!data.get("_image").isNull()) {
                imageData = data.get("_image").asText();
            }

            if (StringUtils.isNotEmpty(imageData)) {
                URLData urlData = URLData.parse(imageData);

                String imagePath = fileServer.saveImage("images/users/", urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                user.setImage(imagePath);
            } else {
                if (user.getImage() != null) {
                    fileServer.deleteFile(user.getImage());
                }

                user.setImage(null);
            }

            String coverData = null;
            if (!data.get("_cover").isNull()) {
                coverData = data.get("_cover").asText();
            }

            if (StringUtils.isNotEmpty(coverData)) {
                URLData urlData = URLData.parse(coverData);

                String coverPath = fileServer.saveImage("images/covers/", urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                user.setCoverImage(coverPath);
            } else {
                if (user.getCoverImage() != null) {
                    fileServer.deleteFile(user.getCoverImage());
                }

                user.setCoverImage(null);
            }

            usersRepository.save(user);
        } catch (Exception e) {
            throw new OperationException(e);
        }
    }
}
