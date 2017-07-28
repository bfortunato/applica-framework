package applica.framework.widgets.mapping;

import applica.framework.AEntity;
import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.fileserver.FileServer;
import applica.framework.library.base64.URLData;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

/**
 * Created by bimbobruno on 14/02/2017.
 */
public class EntityMapper {

    @Autowired(required = false)
    private FileServer fileServer;

    @FunctionalInterface
    public interface Setter<T extends Entity> {
        void set(T value);
    }

    @FunctionalInterface
    public interface Getter<T extends Entity> {
        T get();
    }

    public void property(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty, Function<Object, Object> supplier) {
        Objects.requireNonNull(destination, "Cannot map property: entity is null");
        Objects.requireNonNull(source, "Cannot map property: node is null");

        Object value;
        try {
            value = PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (value == null) {
            destination.set(destinationProperty, NullNode.getInstance());
        } else {
            Object finalValue = supplier == null ? value : supplier.apply(value);
            if (finalValue == null) {
                destination.set(destinationProperty, NullNode.getInstance());
            } else {
                destination.putPOJO(destinationProperty, finalValue);
            }
        }
    }

    public void property(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, Function<JsonNode, Object> supplier) {
        Objects.requireNonNull(destination, "Cannot map property: entity is null");
        Objects.requireNonNull(source, "Cannot map property: node is null");

        JsonNode jsonNode = source.get(sourceProperty);
        if (jsonNode != null && !jsonNode.isNull()) {
            Object finalValue = supplier == null ? jsonNode.textValue() : supplier.apply(jsonNode);

            try {
                PropertyUtils.setProperty(destination, destinationProperty, finalValue);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                PropertyUtils.setProperty(destination, destinationProperty, null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void idToEntity(ObjectNode source, Entity destination, Class<? extends Entity> relatedType, String sourceProperty, String destinationProperty){
        Objects.requireNonNull(destination, "Cannot convert id to entity: entity is null");
        Objects.requireNonNull(source, "Cannot convert id to entity: node is null");

        String id = source.get(sourceProperty).asText();
        if (!StringUtils.isEmpty(id)) {
            Optional<? extends Entity> relatedEntity = Repo.of(relatedType).get(id);
            if (!relatedEntity.isPresent()) {
                throw new RuntimeException(String.format("%s: %s", sourceProperty, id));
            }

            try {
                PropertyUtils.setProperty(destination, destinationProperty, relatedEntity.get());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                PropertyUtils.setProperty(destination, destinationProperty, null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void idToEntity(Entity source, ObjectNode destination, Class<? extends Entity> relatedType, String sourceProperty, String destinationProperty){
        Objects.requireNonNull(source, "Cannot convert id to entity: entity is null");
        Objects.requireNonNull(destination, "Cannot convert id to entity: node is null");

        Object id;
        try {
            id = PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (id == null) {
            destination.set(destinationProperty, NullNode.getInstance());
        } else {
            Entity relatedEntity = Repo.of(relatedType).get(id).orElse(null);
            if (relatedEntity == null) {
                destination.set(destinationProperty, NullNode.getInstance());
            } else {
                EntitySerializer serializer = new DefaultEntitySerializer(relatedType);
                try {
                    destination.set(destinationProperty, serializer.serialize(relatedEntity));
                } catch (SerializationException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void entityToId(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty) {
        Objects.requireNonNull(source, "Cannot convert entity to id: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to id: node is null");

        Entity relatedEntity = null;
        try {
            relatedEntity = (Entity) PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (relatedEntity == null) {
            destination.put(destinationProperty, "");
        } else {
            String id = relatedEntity.getId() != null ? relatedEntity.getId().toString() : null;
            destination.put(destinationProperty, id);
        }
    }

    public void entityToId(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty) {
        Objects.requireNonNull(source, "Cannot convert entity to id: node is null");
        Objects.requireNonNull(destination, "Cannot convert entity to id: entity is null");

        JsonNode sourceNode = source.get(sourceProperty);

        Object id = null;

        if (sourceNode != null && !sourceNode.isNull()) {
            ObjectNode sourceEntityNode = (ObjectNode) sourceNode;

            id = AEntity.checkedId(sourceEntityNode.get("id").asText());
        }

        try {
            BeanUtils.setProperty(destination, destinationProperty, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void imageToDataUrl(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty, String size) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(source, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to image: node is null");

        String imageUrl = null;
        try {
            imageUrl = (String) PropertyUtils.getProperty(source, sourceProperty);
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
                destination.put(destinationProperty, urlData.write());
            } else {
                destination.put(destinationProperty, "");
            }
        }
    }

    public void dataUrlToImage(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to image: node is null");

        String imageData = null;

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            imageData = source.get(sourceProperty).asText();
        }

        if (StringUtils.isNotEmpty(imageData)) {
            try {
                URLData urlData = URLData.parse(imageData);
                String imagePath = fileServer.saveImage(path, urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                PropertyUtils.setProperty(destination, destinationProperty, imagePath);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                String actualImage = (String) PropertyUtils.getProperty(destination, destinationProperty);
                if (actualImage != null) {
                    fileServer.deleteFile(actualImage);
                }

                PropertyUtils.setProperty(destination, destinationProperty, null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void dataUrlToFile(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to file: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to file: node is null");

        String fileData = null;

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            fileData = source.get(sourceProperty).asText();
        }

        if (StringUtils.isNotEmpty(fileData)) {
            try {
                URLData urlData = URLData.parse(fileData);
                String filePath = fileServer.saveFile(path, urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                PropertyUtils.setProperty(destination, destinationProperty, filePath);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                String actualFile = (String) PropertyUtils.getProperty(destination, destinationProperty);
                if (actualFile != null) {
                    fileServer.deleteFile(actualFile);
                }

                PropertyUtils.setProperty(destination, destinationProperty, null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

}
