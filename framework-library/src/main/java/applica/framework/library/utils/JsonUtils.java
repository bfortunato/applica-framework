package applica.framework.library.utils;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;

public class JsonUtils {
    public static <T> T convertJsonToObject(String jsonContent, Class<T> type) {
        T model = null;
        if (!StringUtils.hasLength(jsonContent))
            return model;

        ObjectMapper mapper = new ObjectMapper();
        try {
            model = mapper.readValue(jsonContent, type);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return model;
    }

    public static <T> List<T> convertJsonToObjectList(String jsonContent, Class<T> type) {
        List<T> l = null;
        if (!StringUtils.hasLength(jsonContent))
            return l;

        ObjectMapper mapper = new ObjectMapper();
        try {
            JavaType t = mapper.getTypeFactory().constructCollectionType(List.class, type);
            l = mapper.readValue(jsonContent, t);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return l;
    }

    public static <T> String convertObjectToJson(T object) {
        String response = null;
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            response = objectMapper.writeValueAsString(object);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return response;
    }
}
