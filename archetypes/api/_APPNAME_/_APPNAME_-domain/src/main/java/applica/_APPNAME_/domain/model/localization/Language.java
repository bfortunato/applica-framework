package applica._APPNAME_.domain.model.localization;

/**
 * Created by antoniolovicario on 28/11/16.
 */

public class Language {

    /**
     * Linguaggi supportati dal sistema. Sono costanti statiche in quanto l'aggiunta o rimozione di un nuovo idioma comporta necessariamente
     * nuovi sviluppi
     */

    public static final String IT = "it";
    public static final String EN = "en";

    public static final String getDefaultLanguage() {
        return IT;
    }
}