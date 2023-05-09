package applica.framework.library.mail;

import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.library.velocity.VelocityBuilderProvider;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.runtime.resource.loader.StringResourceLoader;
import org.apache.velocity.runtime.resource.util.StringResourceRepository;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.StringUtils;

import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.util.ByteArrayDataSource;
import java.io.StringWriter;
import java.util.*;
import static org.apache.commons.codec.CharEncoding.UTF_8;

public class TemplatedMail {

    private Log logger = LogFactory.getLog(getClass());


    public static final int HTML = 1;
    public static final int TEXT = 2;

    private VelocityContext context;
    private String templatePath;
    private String source;
    private String from;
    private String returnReceipt;
    private List<Recipient> recipients = new ArrayList<>();
    private String subject;
    private List<String> attachments = new ArrayList<>();
    private HashMap<String, String> inlineAttachments = new HashMap<>();
    private List<ByteAttachmentData> bytesAttachments = new ArrayList<>();
    private HashMap<String, ByteAttachmentData> inlineBytesAttachments = new HashMap<>();
    private OptionsManager options;
    private int mailFormat;

    private String encoding;

    private String mailText;

    public String getMailText() {
        return mailText;
    }

    public void setMailText(String mailText) {
        this.mailText = mailText;
    }

    private class ByteAttachmentData {
        byte[] bytes;
        String type;
        String name;

        public ByteAttachmentData(byte[] bytes, String type, String name) {
            this.bytes = bytes;
            this.type = type;
            this.name = name;
        }
    }

    public TemplatedMail() {
        context = new VelocityContext();
    }
    public String getReturnReceipt() {
        return returnReceipt;
    }

    public void setReturnReceipt(String returnReceipt) {
        this.returnReceipt = returnReceipt;
    }


    public String getTemplatePath() {
        return templatePath;
    }

    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public OptionsManager getOptions() {
        return options;
    }

    public void setOptions(OptionsManager options) {
        this.options = options;
    }

    public void put(String key, Object value) {
        context.put(key, value);
    }

    public List<Recipient> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<Recipient> recipients) {
        this.recipients = recipients;
    }

    public int getMailFormat() {
        return mailFormat;
    }

    public void setMailFormat(int mailFormat) {
        this.mailFormat = mailFormat;
    }

    public String getEncoding() {
        return encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public void addAttachment(byte[] data, String type, String name) {
        bytesAttachments.add(new ByteAttachmentData(data, type, name));
    }

    public HashMap<String, String> getInlineAttachments() {
        return inlineAttachments;
    }

    public void setInlineAttachments(HashMap<String, String> inlineAttachments) {
        this.inlineAttachments = inlineAttachments;
    }

    public void addInlineAttachment(String contentId, byte[] data, String type, String name) {
        this.inlineBytesAttachments.put(contentId, new ByteAttachmentData(data, type, name));
    }

    public void send() throws MailException, AddressException, MessagingException {
        if (options == null) {
            throw new MailException("options not setted");
        }
        if (!StringUtils.hasLength(from)) {
            throw new MailException("from not setted");
        }
        if (recipients.isEmpty()) {
            throw new MailException("to or recipients not setted");
        }

        if (this.encoding == null) {
            this.setEncoding(UTF_8);
        }

        Session session = MailUtils.getMailSession(options);
        String tslEnable = options.get("smtp.tsl.enable");
        if (!StringUtils.hasLength(tslEnable)) {
            tslEnable = "true";
        }

        if ("true".equals(tslEnable)) {
            session.getProperties().setProperty("mail.smtp.starttls.enable", "true");
            session.getProperties().setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        }

        MimeMessage message = new MimeMessage(session);
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, mailFormat == HTML, this.encoding);

        messageHelper.setFrom(new InternetAddress(from));
        List<InternetAddress> toRecipients = new ArrayList<>();
        List<InternetAddress> ccRecipients = new ArrayList<>();
        List<InternetAddress> ccnRecipients = new ArrayList<>();

        for (Recipient r : this.recipients) {
            switch (r.getRecipientType()) {
                case Recipient.TYPE_TO:
                    toRecipients.add(new InternetAddress(r.getRecipient()));
                    break;
                case Recipient.TYPE_CC:
                    ccRecipients.add(new InternetAddress(r.getRecipient()));
                    break;
                case Recipient.TYPE_CCN:
                    ccnRecipients.add(new InternetAddress(r.getRecipient()));
                    break;
            }
        }

        messageHelper.setTo(toRecipients.toArray(InternetAddress[]::new));
        messageHelper.setCc(ccRecipients.toArray(InternetAddress[]::new));
        messageHelper.setBcc(ccnRecipients.toArray(InternetAddress[]::new));

        messageHelper.setSubject(subject);

        Template template = null;
        if (StringUtils.hasLength(source)) {
            var templateName = UUID.randomUUID().toString();
            StringResourceRepository repo = (StringResourceRepository) VelocityBuilderProvider.provide().engine().getApplicationAttribute(StringResourceLoader.REPOSITORY_NAME_DEFAULT);
            repo.putStringResource(templateName, source);
        }

        template = VelocityBuilderProvider.provide().engine().getTemplate(templatePath, this.encoding);
        StringWriter bodyWriter = new StringWriter();
        template.merge(context, bodyWriter);

        messageHelper.setText(bodyWriter.toString(), mailFormat == HTML);

        if (attachments != null) {
            for (String attachment : attachments) {
                String fileName = FilenameUtils.getName(attachment);
                DataSource source = new FileDataSource(attachment);
                messageHelper.addAttachment(fileName, source);
            }
        }

        if (bytesAttachments != null) {
            for (TemplatedMail.ByteAttachmentData data : bytesAttachments) {
                String fileName = FilenameUtils.getName(data.name);
                DataSource source = new ByteArrayDataSource(data.bytes, data.type);
                messageHelper.addAttachment(fileName, source);
            }
        }

        if (this.inlineAttachments != null) {
            for (Map.Entry<String, String> entry : this.inlineAttachments.entrySet()) {
                String contentId = entry.getKey();
                String attachment = entry.getValue();
                DataSource source = new FileDataSource(attachment);
                messageHelper.addInline(contentId, source);
            }
        }

        if (this.inlineBytesAttachments != null) {
            for (Map.Entry<String, ByteAttachmentData> entry: this.inlineBytesAttachments.entrySet()) {
                String contentId = entry.getKey();
                ByteAttachmentData byteAttachmentData = entry.getValue();
                DataSource source = new ByteArrayDataSource(byteAttachmentData.bytes, byteAttachmentData.type);
                messageHelper.addInline(contentId, source);
            }
        }

        message = messageHelper.getMimeMessage();

        //gestisci la ricevuta di ritorno, se il suo destinatario è settato
        if (StringUtils.hasLength(returnReceipt)) {
            message.setHeader("Return-Receipt-To:",String.format("<%s>", returnReceipt));
        }


        if (SystemOptionsUtils.isEnabled("log.email")) {
            this.mailText = bodyWriter.toString();
        }

        Transport.send(message);
    }

    public String getTo() {
        return this.recipients.size() > 0? this.recipients.get(0).getRecipient() : null;
    }

    public void setTo(String mail) {
        this.recipients.add(new Recipient(mail, Recipient.TYPE_TO));
    }

    public void addCc(String mail) {
        this.recipients.add(new Recipient(mail, Recipient.TYPE_CC));
    }

    public void addBcc(String mail) {
        this.recipients.add(new Recipient(mail, Recipient.TYPE_CCN));
    }

}