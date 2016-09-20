package applica._APPNAME_.admin.controllers;

import applica._APPNAME_.admin.fields.renderers.*;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormCreationException;
import applica.framework.widgets.FormDescriptor;
import applica.framework.widgets.fields.Params;
import applica.framework.widgets.fields.Values;
import applica.framework.widgets.fields.renderers.*;
import applica.framework.widgets.forms.renderers.DefaultFormRenderer;
import applica.framework.library.responses.ErrorResponse;
import applica.framework.library.responses.FormResponse;
import applica.framework.library.responses.SimpleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/1/13
 * Time: 10:08 AM
 */
@Controller
@RequestMapping("/librarydemo")
public class LibraryDemoController {

    @Autowired ApplicationContext context;

    @RequestMapping("/form")
    public @ResponseBody SimpleResponse form() {
        try {
            FormResponse formResponse = new FormResponse();

            Form form = new Form();
            form.setRenderer(context.getBean(DefaultFormRenderer.class));

            FormDescriptor descriptor = new FormDescriptor(form);
            descriptor.addField("check", Boolean.class, "check", "Standard controls", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("color", String.class, "color", "Standard controls", context.getBean(ColorFieldRenderer.class))
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("mail", String.class, "mail", "Standard controls", context.getBean(MailFieldRenderer.class))
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("password", String.class, "password", "Standard controls", context.getBean(PasswordFieldRenderer.class))
                    .putParam(Params.PLACEHOLDER, "Type password here")
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("date", Date.class, null, "Date and time", context.getBean(DatePickerRenderer.class))
                    .putParam(Params.PLACEHOLDER, "Date")
                    .putParam(Params.ROW, "dt")
                    .putParam(Params.COLS, Values.COLS_4)
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("time", String.class, null, "Date and time", context.getBean(TimePickerRenderer.class))
                    .putParam(Params.PLACEHOLDER, "Time")
                    .putParam(Params.ROW, "dt")
                    .putParam(Params.COLS, Values.COLS_4)
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("datetime", Date.class, null, "Date and time", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.PLACEHOLDER, "Datetime")
                    .putParam(Params.ROW, "dt")
                    .putParam(Params.COLS, Values.COLS_4)
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("file", String.class, "file", "Advanced", context.getBean(LibraryDemoFileRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("image", String.class, "image", "Advanced", context.getBean(LibraryDemoImageRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("percentage", Integer.class, "percentage", "Advanced", context.getBean(PercentageFieldRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("readonly", Integer.class, "readonly", "Advanced", context.getBean(ReadOnlyFieldRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("select", String.class, "select", "Advanced", context.getBean(LibraryDemoSelectRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("textarea", String.class, "textarea", "Advanced", context.getBean(TextAreaFieldRenderer.class)).putParam(Params.TAB, "First Tab");
            descriptor.addField("html", String.class, "html", "Advanced", context.getBean(HtmlFieldRenderer.class)).putParam(Params.TAB, "First Tab");

            descriptor.addField("text1", String.class, "text1", "Custom layout", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("text2", String.class, null, "Custom layout", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "First Tab")
                    .putParam(Params.PLACEHOLDER, "Text field without description");


            descriptor.addField("singleSearchableInput", String.class, "singleSearchableInput", "Searchable controls", context.getBean(LibraryDemoSingleSearchableInputRenderer.class))
                    .putParam(Params.TAB, "First Tab");
            descriptor.addField("multiSearchableInput", List.class, "multiSearchableInput", "Searchable controls", context.getBean(LibraryDemoMultiSearchableInputRenderer.class))
                    .putParam(Params.TAB, "First Tab");

            descriptor.addField("check2", Boolean.class, "check", "Standard controls 2", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2");
            descriptor.addField("color2", String.class, "color", "Standard controls 2", context.getBean(ColorFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2");
            descriptor.addField("mail2", String.class, "mail", "Standard controls 2", context.getBean(MailFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2");
            descriptor.addField("password2", String.class, "password", "Standard controls 2", context.getBean(PasswordFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2")
                    .putParam(Params.PLACEHOLDER, "Type password here");
            descriptor.addField("text12", String.class, "text1", "Custom layout 2", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2");
            descriptor.addField("text221", String.class, null, "Custom layout 2", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2")
                    .putParam(Params.PLACEHOLDER, "Text field without description")
                    .putParam(Params.ROW, "couple")
                    .putParam(Params.COLS, Values.COLS_6);
            descriptor.addField("text222", String.class, null, "Custom layout 2", context.getBean(DefaultFieldRenderer.class))
                    .putParam(Params.TAB, "Tab 2")
                    .putParam(Params.PLACEHOLDER, "Text field without description2")
                    .putParam(Params.ROW, "couple")
                    .putParam(Params.COLS, Values.COLS_6);


            form.setTitle("Library demo form");
            formResponse.setTitle("Library demo form");
            formResponse.setContent(form.writeToString());

            return formResponse;
        } catch (FormCreationException e) {
            return new ErrorResponse(e.getMessage());
        } catch (CrudConfigurationException e) {
            return new ErrorResponse(e.getMessage());
        } catch(Exception e) {
            return new ErrorResponse(e.getMessage());
        }
    }

}
