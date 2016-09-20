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
import java.io.StringWriter;
import java.util.List;

public class TemplatedMail {

    private Log logger = LogFactory.getLog(getClass());

    public static final int HTML = 1;
    public static final int TEXT = 2;

    private VelocityContext context;
    private String templatePath;
    private String from;
    private String to;
    private String returnReceipt;
    private List<Recipient> recipients;
    private String subject;
    private List<String> attachments;
    private OptionsManager options;
    private int mailFormat;

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

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
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

    public void send() throws MailException, AddressException, MessagingException {
        if (options == null) throw new MailException("options not setted");
        if (!StringUtils.hasLength(from)) throw new MailException("from not setted");
        if (!StringUtils.hasLength(to) && recipients.isEmpty()) throw new MailException("to or recipients not setted");
        if(mailFormat == 0){
            mailFormat = TEXT;
        }

        Session session = MailUtils.getMailSession(options);
        MimeMessage message = new MimeMessage(session);
        message.addFrom(new InternetAddress[]{new InternetAddress(from)});

        if(StringUtils.hasLength(to)){
            message.addRecipient(RecipientType.TO, new InternetAddress(to));
        }else if(!recipients.isEmpty()){
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

        logger.info(String.format("Sending email '%s' with template '%s' to '%s'", subject, templatePath, to));

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
        System.out.println("Sent message successfully....");
    }

    private static void addAttachment(Multipart multipart, String attachment) throws MessagingException {
        DataSource source = new FileDataSource(attachment);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setDataHandler(new DataHandler(source));
        messageBodyPart.setFileName(FilenameUtils.getName(attachment));
        multipart.addBodyPart(messageBodyPart);
    }


}
