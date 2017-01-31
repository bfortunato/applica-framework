package applica.framework.library.base64;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.MimeType;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by bimbobruno on 27/01/2017.
 */
public class URLData {

    public URLData(String mimeType, InputStream in) {
        this.mimeType = MimeType.valueOf(mimeType);

        try {
            byte[] bytes = IOUtils.toByteArray(in);
            IOUtils.closeQuietly(in);
            this.bytes = bytes;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static URLData parse(String data) throws InvalidDataException {
        URLData urlData = new URLData();
        urlData.read(data);

        return urlData;
    }

    private MimeType mimeType;
    private byte[] bytes;

    public URLData() {

    }

    public URLData(String mimeType, byte[] bytes) {
        this.mimeType = MimeType.valueOf(mimeType);
        this.bytes = bytes;
    }

    public MimeType getMimeType() {
        return mimeType;
    }

    public void setMimeType(MimeType mimeType) {
        this.mimeType = mimeType;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public void read(String data) throws InvalidDataException {
        if (StringUtils.isEmpty(data)) {
            mimeType = null;
            bytes = null;
        } else {
            if (!data.startsWith("data:")) {
                throw new InvalidDataException(data);
            }

            int index = data.indexOf(";");
            if (index == -1) {
                throw new InvalidDataException(data);
            }

            String mimeType = data.substring(5, index);
            if (StringUtils.isEmpty(mimeType)) {
                throw new InvalidDataException(data);
            }

            index = data.indexOf("base64,");
            if (index == -1) {
                throw new InvalidDataException(data);
            }

            String base64 = data.substring(index + 7);
            if (StringUtils.isEmpty(base64)) {
                throw new InvalidDataException(data);
            }

            byte[] bytes = Base64.decodeBase64(base64);

            this.bytes = bytes;
            this.mimeType = MimeType.valueOf(mimeType);
        }
    }

    public String write() {
        if (bytes == null || mimeType == null) {
            return null;
        }

        String base64 = Base64.encodeBase64String(bytes);

        return String.format("data:%s;base64,%s", mimeType.toString(), base64);
    }
}
