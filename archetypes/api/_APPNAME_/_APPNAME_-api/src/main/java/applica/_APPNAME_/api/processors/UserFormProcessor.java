package applica._APPNAME_.api.processors;

import applica._APPNAME_.api.utils.URLData;
import applica._APPNAME_.domain.model.User;
import applica.framework.Entity;
import applica.framework.fileserver.FileServer;
import applica.framework.widgets.processors.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class UserFormProcessor implements FormProcessor {

    @Autowired
    private FileServer fileServer;

    @Override
    public Entity process(ObjectNode data) throws FormProcessException {
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

            return user;
        } catch (Exception e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public ObjectNode deprocess(Entity entity) throws FormProcessException {
        try {
            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            User user = ((User) entity);
            ObjectNode node = entitySerializer.serialize(user);

            if (StringUtils.isNotEmpty(user.getImage())) {
                InputStream in = fileServer.getImage(user.getImage(), "250x*");
                URLData urlData = new URLData(String.format("image/%s", FilenameUtils.getExtension(user.getImage())), in);
                node.put("_image", urlData.write());
            }

            return node;
        } catch (Exception e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return User.class;
    }
}
