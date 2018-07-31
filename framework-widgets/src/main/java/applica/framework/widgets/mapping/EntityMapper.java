package applica.framework.widgets.mapping;

import applica.framework.AEntity;
import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.fileserver.FileServer;
import applica.framework.library.SimpleItem;
import applica.framework.library.base64.URLData;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

import static applica.framework.library.utils.LangUtils.unchecked;

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

    @FunctionalInterface
    public interface ChildrenConsumer<T1, T2> {
        void accept(T1 source, T2 destination) throws OperationException;
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

    public <T> void children(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty, Class<T> sourceElementType, ChildrenConsumer<T, ObjectNode> consumer) throws OperationException {
        if (source == null || destination == null || destination.isNull()) {
            return;
        }

        List<T> sourceList = null;
        try {
            sourceList = ((List<T>) PropertyUtils.getProperty(source, sourceProperty));
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            e.printStackTrace();
        }

        if (sourceList == null) {
            return;
        }

        ArrayNode arrayNode = ((ArrayNode) destination.get(destinationProperty));
        if (arrayNode == null || arrayNode.isNull()) {
            return;
        }

        if (sourceList.size() != arrayNode.size()) {
            throw new RuntimeException("Source list and destination array node must have same size");
        }

        int index = 0;
        for (T element : sourceList) {
            ObjectNode jsonElement = ((ObjectNode) arrayNode.get(index));
            if (element != null && jsonElement != null && !jsonElement.isNull()) {
                consumer.accept(element, jsonElement);
            }
        }
    }

    public <T> void children(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, Class<T> destinationElementType, ChildrenConsumer<ObjectNode, T> consumer) throws OperationException {
        if (source == null || source.isNull() || destination == null) {
            return;
        }

        ArrayNode arrayNode = ((ArrayNode) source.get(sourceProperty));
        if (arrayNode == null || arrayNode.isNull()) {
            return;
        }

        List<T> destinationList = null;
        try {
            destinationList = ((List<T>) PropertyUtils.getProperty(destination, destinationProperty));
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            e.printStackTrace();
        }

        if (destinationList == null) {
            return;
        }

        if (destinationList.size() != arrayNode.size()) {
            throw new RuntimeException("Source array node and destination list must have same size");
        }

        int index = 0;
        for (T element : destinationList) {
            ObjectNode jsonElement = ((ObjectNode) arrayNode.get(index));
            if (element != null && jsonElement != null && !jsonElement.isNull()) {
                consumer.accept(jsonElement, element);
            }
        }
    }

    public void idToEntity(ObjectNode source, Entity destination, Class<? extends Entity> relatedType, String sourceProperty, String destinationProperty) {
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

    public void idToEntity(Entity source, ObjectNode destination, Class<? extends Entity> relatedType, String sourceProperty, String destinationProperty) {
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

        String actualImage = null;
        try {
            actualImage = (String) PropertyUtils.getProperty(destination, destinationProperty);
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            e.printStackTrace();
        }

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            imageData = source.get(sourceProperty).asText();
        }

        if (StringUtils.isNotEmpty(imageData)) {
            try {
                URLData urlData = URLData.parse(imageData);
                String imagePath = fileServer.saveImage(path, urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                PropertyUtils.setProperty(destination, destinationProperty, imagePath);
            } catch (IOException e) {
                unchecked(() -> PropertyUtils.setProperty(destination, destinationProperty, null));
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

        String finalActualImage = actualImage;
        new Thread(() -> {
            if (finalActualImage != null) {
                try {
                    fileServer.deleteFile(finalActualImage);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();

    }

    public void dataUrlToFile(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to file: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to file: node is null");

        String fileData = null;

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            fileData = source.get(sourceProperty).asText();
        }

        String actualFile = null;
        try {
            actualFile = (String) PropertyUtils.getProperty(destination, destinationProperty);
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            e.printStackTrace();
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
                PropertyUtils.setProperty(destination, destinationProperty, null);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        String finalActualImage = actualFile;
        new Thread(() -> {
            if (finalActualImage != null) {
                try {
                    fileServer.deleteFile(finalActualImage);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();

    }


    public void imagesToDataUrl(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty, String size) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(source, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to image: node is null");

        List<String> imageDatas = new ArrayList<>();
        List<String> imageUrls = null;
        try {
            imageUrls = (List<String>) PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (imageUrls != null && imageUrls.size() > 0) {
            for (String imageUrl : imageUrls) {
                if (StringUtils.isNotEmpty(imageUrl)) {
                    InputStream in = null;
                    try {
                        in = fileServer.getImage(imageUrl, size);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    if (in != null) {
                        URLData urlData = new URLData(String.format("image/%s", FilenameUtils.getExtension(imageUrl)), in);
                        imageDatas.add(urlData.write());

                    }
                }
            }

            if (imageDatas.size() > 0) {
                ArrayNode array = destination.putArray(destinationProperty);
                for (String urlData : imageDatas) {
                    array.add(urlData);
                }
            }
        }
    }

    public void dataUrlToImages(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to image: node is null");

        List<String> imageDatas = new ArrayList<>();
        List<String> imagesUrls = new ArrayList<>();
        List<String> actualImages = new ArrayList<>();
        try {
            actualImages = (List<String>) PropertyUtils.getProperty(destination, destinationProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            source.get(sourceProperty).forEach(n -> imageDatas.add(n.asText()));
        }

        if (imageDatas.size() > 0) {
            for (String imageData : imageDatas) {
                try {

                    URLData urlData = URLData.parse(imageData);
                    String imagePath = fileServer.saveImage(path, urlData.getMimeType().getSubtype(), new ByteArrayInputStream(urlData.getBytes()));
                    imagesUrls.add(imagePath);

                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

        }
        try {
            PropertyUtils.setProperty(destination, destinationProperty, imagesUrls);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }


        if (actualImages != null) {
            for (String actualImage : actualImages) {
                if (!imagesUrls.contains(actualImage)) {
                    try {
                        fileServer.deleteFile(actualImage);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public void mapToSimpleItem(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty) {
        try {
            Entity entityProperty = (Entity) PropertyUtils.getProperty(source, sourceProperty);
            SimpleItem s = new SimpleItem();
            s.setLabel(entityProperty.toString());
            s.setValue(entityProperty.getId().toString());
            destination.putPOJO(destinationProperty, s);

        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }


    public void entitiesToIds(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty) {
        Objects.requireNonNull(source, "Cannot convert entity to id: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to id: node is null");

        List<Entity> relatedEntities = null;
        try {
            relatedEntities = (List<Entity>) PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        ArrayNode arrayNode = destination.putArray(destinationProperty);
        for (Entity entity : relatedEntities) {
            arrayNode.add(String.valueOf(entity.getId()));
        }
    }

    public void attachmentToDataUrl(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(source, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to image: node is null");

        Attachment file = null;
        try {
            file = (Attachment) PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (file != null) {
            if (StringUtils.isNotEmpty(file.getPath())) {
                destination.putPOJO(destinationProperty, new AttachmentData(file.getName(), file.getPath(), false, file.getSize()));
            }
        }
    }

    public void attachmentsToDataUrl(Entity source, ObjectNode destination, String sourceProperty, String destinationProperty) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(source, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(destination, "Cannot convert entity to image: node is null");

        ArrayNode array = destination.putArray(destinationProperty);
        List<Attachment> files = null;
        try {
            files = (List<Attachment>) PropertyUtils.getProperty(source, sourceProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (files != null && files.size() > 0) {
            for (Attachment attachment : files) {
                if (StringUtils.isNotEmpty(attachment.getPath())) {
                    array.addPOJO(new AttachmentData(attachment.getName(), attachment.getPath(), false, attachment.getSize()));
                }
            }
        }
    }

    public void dataUrlToAttachments(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to image: node is null");

        List<AttachmentData> fileDatas = new ArrayList<>();
        List<Attachment> fileUrls = new ArrayList<>();
        List<Attachment> actualFiles = new ArrayList<>();
        try {
            actualFiles = (List<Attachment>) PropertyUtils.getProperty(destination, destinationProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            source.get(sourceProperty).forEach(n -> fileDatas.add(new AttachmentData(n.get("filename").asText(), n.get("data").asText(), n.get("base64").asBoolean(), n.get("size").asInt())));
        }

        if (fileDatas.size() > 0) {
            for (AttachmentData fileData : fileDatas) {
                try {
                    String filePath;
                    if (fileData.isBase64()) {
                        URLData urlData = URLData.parse(fileData.getData());
                        filePath = fileServer.saveFile(path, FilenameUtils.getExtension(fileData.getFilename()), new ByteArrayInputStream(urlData.getBytes()));
                    } else {
                        filePath = fileData.getData();
                    }

                    fileUrls.add(new Attachment(fileData.getFilename(), filePath, fileData.getSize()));

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
        try {
            PropertyUtils.setProperty(destination, destinationProperty, fileUrls);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (actualFiles != null) {
            for (Attachment actualFile : actualFiles) {
                try {
                    if (fileUrls.stream().noneMatch(file -> file.getPath().equals(actualFile.getPath())))
                        fileServer.deleteFile(actualFile.getPath());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


    public void dataUrlToAttachment(ObjectNode source, Entity destination, String sourceProperty, String destinationProperty, String path) {
        Objects.requireNonNull(fileServer, "Fileserver not injected");
        Objects.requireNonNull(destination, "Cannot convert entity to image: entity is null");
        Objects.requireNonNull(source, "Cannot convert entity to image: node is null");

        AttachmentData fileData = null;
        Attachment fileUrls = null;
        Attachment actualFiles;
        try {
            actualFiles = (Attachment) PropertyUtils.getProperty(destination, destinationProperty);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (source.get(sourceProperty) != null && !source.get(sourceProperty).isNull()) {
            JsonNode n = source.get(sourceProperty);
            fileData = new AttachmentData(n.get("filename").asText(), n.get("data").asText(), n.get("base64").asBoolean(), n.get("size").asInt());
        }

        if (fileData != null) {
            try {
                String filePath;
                if (fileData.isBase64()) {
                    URLData urlData = URLData.parse(fileData.getData());
                    filePath = fileServer.saveFile(path, FilenameUtils.getExtension(fileData.getFilename()), new ByteArrayInputStream(urlData.getBytes()));

                } else {
                    filePath = fileData.getData();
                }

                fileUrls = new Attachment(fileData.getFilename(), filePath, fileData.getSize());

            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        try {
            PropertyUtils.setProperty(destination, destinationProperty, fileUrls);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (actualFiles != null && (fileUrls == null || !actualFiles.getPath().equals(fileUrls.getPath()))) {
            try {
                fileServer.deleteFile(actualFiles.getPath());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}

