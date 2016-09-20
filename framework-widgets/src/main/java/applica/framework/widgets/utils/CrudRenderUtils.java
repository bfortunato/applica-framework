package applica.framework.widgets.utils;

import applica.framework.library.velocity.tools.RenderUtils;
import applica.framework.widgets.FieldSet;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import applica.framework.widgets.fields.Params;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 11/03/15.
 */
public class CrudRenderUtils implements RenderUtils {

    public boolean hasTabs(Form form) {
        return getTabs(form).size() > 1;
    }

    public String tabId(String tab) {
        return tab.replace(" ", "_").replace(".", "_").toLowerCase();
    }

    public List<String> getTabs(Form form) {
        List<String> tabs = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String tabParam = f.getParam(Params.TAB);
            if (StringUtils.isNotEmpty(tabParam)) {
                if (!tabs.contains(tabParam)) {
                    tabs.add(tabParam);
                }
            }
        }

        return tabs;
    }

    public List<FormField> getFieldsInTab(Form form, String tab) {
        List<FormField> fields = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String tabParam = f.getParam(Params.TAB);
            if (tab.equals(tabParam)) {
                fields.add(f);
            }
        }

        return fields;
    }

    public List<String> getFieldSetsInTab(Form form, String tab) {
        List<FormField> fields = getFieldsInTab(form, tab);
        List<String> fieldSets = new ArrayList<>();

        for (FormField f : fields) {
            String fieldSet = f.getFieldSet();
            if (StringUtils.isNotEmpty(fieldSet)) {
                if (!fieldSets.contains(fieldSet)) {
                    fieldSets.add(fieldSet);
                }
            } else {
                if (!fieldSets.contains(FieldSet.DEFAULT)) {
                    fieldSets.add(FieldSet.DEFAULT);
                }
            }
        }

        return fieldSets;
    }

    public List<FormField> getFieldsForSetInTab(Form form, String fieldSet, String tab) {
        List<FormField> fields = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String tabParam = f.getParam(Params.TAB);
            if (tab.equals(tabParam)) {
                if (isFieldSetEqual(fieldSet, f.getFieldSet())) {
                    fields.add(f);
                }
            }
        }

        return fields;
    }

    public boolean isFieldSetEqual(String f1, String f2) {
        if (StringUtils.isEmpty(f1)) {
            f1 = "*";
        }

        if (StringUtils.isEmpty(f2)) {
            f2 = "*";
        }

        return f1.equals(f2);
    }




    //funzionalità per la gestione del form multicolonna
    //*******************************************************
    //*******************************************************
    //*******************************************************

    public boolean hasColumns(Form form){
        return getCols(form).size() > 1;
    }

    public int colNumber(Form form){
        return getCols(form).size();
    }

    public List<String> getCols(Form form){
        List<String> cols = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String colParam = f.getParam(Params.FORM_COLUMN);
            if (StringUtils.isNotEmpty(colParam)) {
                if (!cols.contains(colParam)) {
                    cols.add(colParam);
                }
            }
        }

        return cols;
    }

    public List<String> getTabsInColumn(Form form,String colName){
        List<String> tabs = new ArrayList<>();

        //per ogni field devo verificare se ha l'atrtributio column e l'attributo tab
        //se l'attributo column è uguale al colName inserisco il nome del tab nella lista
        for (FormField s : form.getDescriptor().getVisibleFields()) {
            String colParam = s.getParam(Params.FORM_COLUMN);
            if (colParam != null){
                String tabParam = s.getParam(Params.TAB);

                if (tabParam != null){
                    if (colParam.equals(colName) && !tabs.contains(tabParam)){
                        tabs.add(tabParam);
                    }
                }
            }
        }

        return tabs;
    }






    public  List<String> getFieldSetsInTabForColumn(Form form,  String tabname, String colName){
        List<FormField> fields = getFieldsInColumn(form, colName);
        List<String> fieldSets = new ArrayList<>();

        for (FormField f : fields) {

            if (f.getParam(Params.TAB) != null){
                if (tabname.equals(f.getParam(Params.TAB))){


                    String fieldSet = f.getFieldSet();
                    if (StringUtils.isNotEmpty(fieldSet)) {
                        if (!fieldSets.contains(fieldSet)) {
                            fieldSets.add(fieldSet);
                        }
                    } else {
                        if (!fieldSets.contains(FieldSet.DEFAULT)) {
                            fieldSets.add(FieldSet.DEFAULT);
                        }
                    }

                }
            }


        }

        return fieldSets;
    }

    private List<FormField> getFieldsInColumn(Form form, String colName) {
        List<FormField> fields = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String colParam = f.getParam(Params.FORM_COLUMN);
            if (colName.equals(colParam)) {
                fields.add(f);
            }
        }

        return fields;
    }


    public List<FormField> getFieldsForSetInTabForCol(Form form,String fieldSet,  String tab, String colName){


        List<FormField> fields = new ArrayList<>();

        for (FormField f : form.getDescriptor().getVisibleFields()) {
            String tabParam = f.getParam(Params.TAB);
            String colParam = f.getParam(Params.FORM_COLUMN);
            if (colName.equals(colParam)){
                if (tab.equals(tabParam)){
                    if (fieldSet.equals(f.getFieldSet()) || fieldSet.equals(FieldSet.DEFAULT)) {
                        fields.add(f);
                    }
                }
            }
        }

        return fields;


    }







}
