package applica.framework.licensing;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Objects;

/**
 * Created by bimbobruno on 12/10/15.
 */
public class Encryptor {

    private Key aesKey = null;
    private Cipher cipher = null;

    private String key;

    public Encryptor(String key) {
        Objects.requireNonNull(key);
        this.key = key;
    }

    synchronized private void init() {
        if (aesKey == null) {
            aesKey = new SecretKeySpec(this.getNormalizedKey().getBytes(), "AES");
            try {
                cipher = Cipher.getInstance("AES");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public String encrypt(String text) throws EncryptorException {
        init();
        try {
            cipher.init(Cipher.ENCRYPT_MODE, aesKey);
            return toHexString(cipher.doFinal(text.getBytes()));
        } catch (Exception e) {
            throw new EncryptorException(e);
        }
    }

    public String decrypt(String text) throws EncryptorException {
        init();
        try {
            cipher.init(Cipher.DECRYPT_MODE, aesKey);
            return new String(cipher.doFinal(toByteArray(text)));
        } catch (Exception e) {
            throw new EncryptorException(e);
        }
    }

    private String getNormalizedKey() {
        return String.format("%16s", key).replace(' ', '*');
    }

    public static String toHexString(byte[] array) {
        return DatatypeConverter.printHexBinary(array);
    }

    public static byte[] toByteArray(String s) {
        return DatatypeConverter.parseHexBinary(s);
    }
}