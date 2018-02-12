package applica.framework.library.mail;

import applica.framework.library.options.OptionsManager;
import applica.framework.library.velocity.VelocityBuilderProvider;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.springframework.util.StringUtils;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.util.ByteArrayDataSource;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class TemplatedMail {

    private Log logger = LogFactory.getLog(getClass());

    public static final int HTML = 1;
    public static final int TEXT = 2;

    private VelocityContext context;
    private String templatePath;
    private String from;
    private String returnReceipt;
    private List<Recipient> recipients = new ArrayList<>();
    private String subject;
    private List<String> attachments = new ArrayList<>();
    private List<ByteAttachmentData> bytesAttachments = new ArrayList<>();
    private OptionsManager options;
    private int mailFormat;

    private class ByteAttachmentData {
        byte[] bytes;
        String type;

        public ByteAttachmentData(byte[] bytes, String type) {
            this.bytes = bytes;
            this.type = type;
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

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public void addAttachment(byte[] data, String type) {
        bytesAttachments.add(new ByteAttachmentData(data, type));
    }

    public void send() throws MailException, AddressException, MessagingException {
        if (options == null) throw new MailException("options not setted");
        if (!StringUtils.hasLength(from)) throw new MailException("from not setted");
        if (recipients.isEmpty()) throw new MailException("to or recipients not setted");
        if(mailFormat == 0){
            mailFormat = TEXT;
        }

        Session session = MailUtils.getMailSession(options);
        MimeMessage message = new MimeMessage(session);
        message.addFrom(new InternetAddress[]{new InternetAddress(from)});

        if(!recipients.isEmpty()){
            for(Recipient r : recipients){
                switch (r.getRecipientType()){
                    case Recipient.TYPE_TO:
                        message.addRecipient(RecipientType.TO, new InternetAddress(r.getRecipient()));
                        break;
                    case Recipient.TYPE_CC:
                        message.addRecipient(RecipientType.CC, new InternetAddress(r.getRecipient()));
                        break;
                    case Recipient.TYPE_CCN:
                        message.addRecipient(RecipientType.BCC, new InternetAddress(r.getRecipient()));
                        break;
                }
            }
        }

        message.setSubject(subject);

        Template template = VelocityBuilderProvider.provide().engine().getTemplate(templatePath, "UTF-8");
        StringWriter bodyWriter = new StringWriter();
        template.merge(context, bodyWriter);

        if(attachments != null && !attachments.isEmpty()){

            // Create the message part
            BodyPart messageBodyPart = new MimeBodyPart();

            // Fill the message
            if(mailFormat == TEXT){
                messageBodyPart.setText(bodyWriter.toString());
            } else if (mailFormat == HTML){
                messageBodyPart.setContent(bodyWriter.toString(), "text/html");
            }

            // Create a multipar message
            Multipart multipart = new MimeMultipart();

            // Set text message part
            multipart.addBodyPart(messageBodyPart);

            for(String attachment : attachments){
                addAttachment(multipart, attachment);
            }

            // Send the complete message parts
            message.setContent(multipart);



        }else if(mailFormat == TEXT){
            message.setContent(bodyWriter.toString(),"text/plain" );
            message.setText(bodyWriter.toString(), "UTF-8");
        } else if (mailFormat == HTML){
            message.setContent(bodyWriter.toString(), "text/html");
        }
        //gestisci la ricevuta di ritorno, se il suo destinatario è settato
        if (StringUtils.hasLength(returnReceipt)) {
            message.setHeader("Return-Receipt-To:",String.format("<%s>", returnReceipt));
        }

        Transport.send(message);
    }

    private void addByteAttachment(Multipart multipart, ByteAttachmentData data) throws MessagingException {
        DataSource source = new ByteArrayDataSource(data.bytes, data.type);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setDataHandler(new DataHandler(source));
        messageBodyPart.setFileName("conferma_ordine.pdf");
        multipart.addBodyPart(messageBodyPart);
    }

    private static void addAttachment(Multipart multipart, String attachment) throws MessagingException {
        DataSource source = new FileDataSource(attachment);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setDataHandler(new DataHandler(source));
        messageBodyPart.setFileName(FilenameUtils.getName(attachment));
        multipart.addBodyPart(messageBodyPart);
    }


    public void setTo(String mail) {
        this.recipients.add(new Recipient(mail, Recipient.TYPE_TO));
    }

}
