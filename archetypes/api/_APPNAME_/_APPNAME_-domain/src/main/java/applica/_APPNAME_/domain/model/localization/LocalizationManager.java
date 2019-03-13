package applica._APPNAME_.domain.model.localization;

import org.springframework.util.StringUtils;

import java.util.Locale;

/**
 * Created by antoniolovicario on 03/08/17.
 */
public class LocalizationManager {

    private ThreadLocal<String> currentLanguage = new ThreadLocal<>();
    private static LocalizationManager s_instance = null;

    /**
     * Gets security instance for logged user.
     *
     * @return
     */
    public static LocalizationManager getInstance() {
        if (s_instance == null) {
            s_instance = new LocalizationManager();
        }
        return s_instance;
    }

//    private Object getLocalizedValue(List<? extends LocalizedObject> values, String lang) {
//        if(values != null){
//            LocalizedObject languageString = getCurrentLanguageItem(values, lang);
//            if(languageString!=null)
//                return languageString.getValue();
//        }
//        return null;
//    }
//
//    private LocalizedObject getCurrentLanguageItem(List<? extends LocalizedObject> values, String lang) {
//        return values != null? values.stream().filter(item -> item.getLang().equals(StringUtils.hasLength(lang) ? lang : getCurrentLanguage())).findFirst().orElse(null) : null;
//    }
//
//    public String getStringLocalizedValue(List<? extends LocalizedObject> values) {
//        Object value = getLocalizedValue(values, null);
//        return value != null ? String.valueOf(value) : null;
//    }
//
//    private String getCurrentLanguage() {
//        return StringUtils.hasLength(currentLanguage) ? currentLanguage : Language.getDefaultLanguage();
//    }
//
//
//    public List<LocalizedString> setStringLocalizedValue(List<LocalizedString> previousValues, String newValue) {
//        if (previousValues == null)
//            previousValues = new ArrayList<>();
//        LocalizedString localizedValue = (LocalizedString) getCurrentLanguageItem(previousValues, null);
//        if (localizedValue != null)
//            localizedValue.setValue(newValue);
//        else
//            previousValues.add(new LocalizedString(getCurrentLanguage(), newValue));
//
//        return previousValues;
//    }

    public void setCurrentLanguage(String currentLanguage) {
        this.currentLanguage.set(currentLanguage);
    }

    public String getCurrentLanguage() {
        return this.currentLanguage.get();
    }

    public Locale getCurrentLocale() {
        return getLocaleByLanguage(StringUtils.hasLength(currentLanguage.get()) ? currentLanguage.get() : getDefaultLanguage());
    }

    public static Locale getLocaleByLanguage(String lang) {
        switch (lang) {
            case Language.EN:
                return Locale.ENGLISH;
            default:
                return Locale.ITALIAN;
        }
    }

//    public static String concatAllLocalizedValue(List<LocalizedString> values) {
//        return values.stream().map(v -> v.getValue()).collect(Collectors.joining(", "));
//    }
//
//
    public String getDefaultLanguage() {
        return Language.getDefaultLanguage();
    }
//
//    public String getStringValue(List<LocalizedString> values, String lang) {
//        Object value = getLocalizedValue(values, lang);
//        return value != null ? String.valueOf(value) : null;
//    }
}
