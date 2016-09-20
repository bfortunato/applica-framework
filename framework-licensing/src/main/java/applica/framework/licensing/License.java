package applica.framework.licensing;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;

/**
 * Created by bimbobruno on 12/10/15.
 */
public class License {

    private String user;
    private Date validity;
    private byte[] bytes;

    public License(String user, Date validity) {
        this.user = user;
        this.validity = validity;
    }

    public License(String user, byte[] bytes) {
        this.user = user;
        this.bytes = bytes;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Date getValidity() {
        return validity;
    }

    public void setValidity(Date validity) {
        this.validity = validity;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public void generate() throws LicenseGenerationException {
        Objects.requireNonNull(user);
        Objects.requireNonNull(validity);

        StringBuilder builder = new StringBuilder();
        builder.append("applicaframework16$");
        builder.append(user);
        builder.append("$");
        builder.append(String.format("%d", validity.getTime()));

        Encryptor encryptor = new Encryptor(user);
        String encrypted = null;
        try {
            encrypted = encryptor.encrypt(builder.toString());
        } catch (EncryptorException e) {
            throw new LicenseGenerationException("Error encrypting license", e);
        }

        try {
            bytes = Base64.getEncoder().encode(encrypted.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new LicenseGenerationException("Unsupported encoding", e);
        }
    }

    public void validate() throws InvalidLicenseException {
        Objects.requireNonNull(user);
        Objects.requireNonNull(bytes);

        byte[] decodedBytes = Base64.getDecoder().decode(bytes);
        try {
            Encryptor encryptor = new Encryptor(user);
            String crypted = new String(decodedBytes, "UTF-8");
            String licenseString = encryptor.decrypt(crypted);
            String[] split = licenseString.split("\\$");
            if (split.length != 3) {
                throw new InvalidLicenseException("format");
            }

            String version = split[0];
            String user = split[1];
            String timeString = split[2];
            long time = Long.parseLong(timeString);

            if (!version.equals("applicaframework16")) {
                throw new InvalidLicenseException("version");
            }

            if (!user.equals(this.user)) {
                throw new InvalidLicenseException("user");
            }

            long now = new Date().getTime();
            if (time < now) {
                throw new InvalidLicenseException("time");
            }
        } catch (UnsupportedEncodingException e) {
            throw new InvalidLicenseException("Unsupported encoding", e);
        } catch (EncryptorException e) {
            throw new InvalidLicenseException("Error decrypting license", e);
        }
    }
}
