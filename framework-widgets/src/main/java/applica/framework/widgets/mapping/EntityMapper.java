package applica.framework.widgets.mapping;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.tools.config.Property;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Optional;

/**
 * Created by bimbobruno on 14/02/2017.
 */
public class EntityMapper {

    @Autowired(required = false)
    private FileServer fileServer;

    public static final String PREFIX = "_";

    @FunctionalInterface
    public interface Setter<T extends Entity> {
        void set(T value);
    }

    @FunctionalInterface
    public interface Getter<T extends Entity> {
        T get();
    }

    public void idToEntity(ObjectNode node, Entity entity, Class<? extends Entity> relatedType, String property){
        Objects.requireNonNull(entity, "Cannot convert id to entity: entity is null");
        Objects.requireNonNull(node, "Cannot convert id to entity: node is null");

        String id = node.get(PREFIX + property).asText();
        if (!StringUtils.isEmpty(id)) {
            Optional<? extends Entity> relatedEntity = Repo.of(relatedType).get(id);
            if (!relatedEntity.isPresent()) {
                throw new RuntimeException(String.format("%s: %s", property, id));
            }

            try {
                PropertyUtils.setProperty(entity, property, relatedEntity.get());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void entityToId(Entity entity, ObjectNode node, String property) {
        Objects.requireNonNull(entity, "Cannot convert entity to id: entity is null");
        Objects.requireNonNull(node, "Cannot convert entity to id: node is null");

        Entity relatedEntity = null;
        try {
            relatedEntity = (Entity) PropertyUtils.getProperty(entity, property);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (relatedEntity == null) {
            node.put(PREFIX + property, "");
        } else {
            String id = relatedEntity.getId() != null ? relatedEntity.getId().toString() : null;
            node.put(PREFIX + property, id);
        }

    }

    public void imageToDataUrl(Entity entity, ObjectNode node, String property, String size) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(entity, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(node, "Cannot convert entity to image: node is null");

        String imageUrl = null;
        try {
            imageUrl = (String) PropertyUtils.getProperty(entity, property);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (StringUtils.isNotEmpty(imageUrl)) {
            InputStream in = null;
            try {
                in = fileServer.getImage(imageUrl, size);
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (in != null) {
                URLData urlData = new URLData(String.format("image/%s", FilenameUtils.getExtension(imageUrl)), in);
                node.put(PREFIX + property, urlData.write());
            } else {
                node.put(PREFIX + property, "");
            }
        }
    }

    public void dataUrlToImage(ObjectNode node, Entity entity, String property, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(entity, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(node, "Cannot convert entity to image: node is null");

        String imageData = null;
        if (!node.get(PREFIX + property).isNull()) {
            imageData = node.get(PREFIX + property).asText();
        }

        if (StringUtils.isNotEmpty(imageData)) {
            try {
                URLData urlData = URLData.parse(imageData);
                String imagePath = fileServer.saveImage(path, urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                PropertyUtils.setProperty(entity, property, imagePath);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                String actualImage = (String) PropertyUtils.getProperty(entity, property);
                if (actualImage != null) {
                    fileServer.deleteFile(actualImage);
                }

                PropertyUtils.setProperty(entity, property, null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

}
