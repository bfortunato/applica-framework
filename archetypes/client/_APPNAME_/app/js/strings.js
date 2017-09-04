let language = "it"

let strings = {}
strings["en"] = {
    appName: "_APPNAME_",
    registering: "Registering...",
    ooops: "Ooops...",
    badLogin: "Cannot login! Please check your email address or password!",
    welcome: "Welcome",
    congratulations: "Congratulations",
    welcomeMessage: "Hi {0}, your registration is complete.\nA confirmation link was sent to {1}.\nPlease confirm before login",
    continue: "Continue",
    register: "Register",
    forgotPassword: "Forgot password",
    signIn: "Sign in",
    mailAddress: "Mail Address",
    name: "Name",
    password: "Password",
    accountConfirmText: "Insert activation code that we sent to your mailbox to confirm your account",
    accountConfirmed: "Your account is confirmed. You can login now",
    mailAndPasswordRequired: "Email and password are required",
    nameMailAndPasswordRequired: "Name, email and password are required",
    mailRequired: "Email is required",
    activationCodeRequired: "Activation code required",
    accountRecoverText: "Please insert your email address to recover password. We will send a new password in your mailbox!",
    problemOccoured: "There is a problem",
    accountRecovered: "A new password was sent to {0}",
    pleaseSpecifyId: "Please specify an ID",
    pleaseSpecifyQuery: "Please specify a query",
    pleaseSpecifyEntity: "Please specify the entity",
    search: "Search",
    close: "Close",
    selectFilterType: "Select filter type",
    filterType: "Filter type",
    typeValueToSearch: "Type value to search",
    value: "Value",
    filters: "Filters",
    pagination: "Showing {0} to {1} of {2}",
    noResults: "there are no results with the specified criteria",
    selectAll: "Select all",
    delete: "Delete",
    create: "Create",
    refresh: "Refresh",
    confirm: "Confirm",
    entityDeleteConfirm: "Are you sure to delete {0} entities?",
    submit: "Submit",
    cancel: "Cancel",
    add: "Add",
    pleaseSpecifyData: "Please specify data",
    ok: "OK",
    security: "Security",
    users: "Users",
    roles: "Roles",
    setup: "Setup",
    categories: "Categories",
    nElementsSelected: "{0} elements selected",
    oneElementSelected: "1 element selected",
    nothingSelected: "Nothing selected",
    usersListDescription: "Create, edit or delete system users",
    mail: "Email",
    active: "Active",
    editUser: "Edit user",
    editUserDescription: "Use this form to edit user informations",
    generalInformations: "General informations",
    rolesListDescription: "A role is an entity that gives to user authorization to do something",
    nameOfRole: "Name of role",
    role: "Role",
    permissions: "Permissions",
    selectPermissions: "Select permissions for role",
    back: "Back",
    save: "Save",
    image: "Image",
    cover: "Cover",
    saveComplete: "Save complete",
    articles: "Articles",
    articlesListDescription: "Articles must exists in Gamma system. Commodo only extends Gamma articles",
    company: "Company",
    id: "ID",
    description: "Description",
    companies: "Companies",
    companiesListDescription: "List of companies, read only!",
    components: "Components",
    componentsListDescription: "Components are base elements of a \"bill of materials\"",
    characteristic: "Characteristic",
    characteristics: "Characteristics",
    nameOfComponent: "Name of component",
    editComponent: "Edit component",
    editComponentDescription: "Use this form to edit component informations",
    optionValue: "Option value",
    nameOfCharacteristic: "Name of characteristic",
    addCharacteristic: "Add characteristic",
    newOption: "New option",
    areYouSureToRemoveCharacteristic: "Are you sure to remove characteristic '{0}'?",
    editArticle: "Edit article",
    editArticleDescription: "Not all article informations are editable in Commodo because is connected to TeamSystem Gamma",
    article: "Article",
    select: "Select",
    component: "Component",
    pleaseSpecifyComponentId: "Please specify component id",
    pleaseSelectComponent: "Please select component",
    characteristicValues: "Characteristic values",
    selectedComponent: "Selected component",
    noComponentSelected: "No component selected",
    versions: "Versions",
    version: "Version",
    versionsListDescription: "Use versions to create configurable associations with models",
    editVersion: "Edit version",
    editVersionDescription: "Use this form to edit version informations",
    nameOfVersion: "Name of version",
    collections: "Collections",
    collection: "Collection",
    collectionsListDescription: "Collections are used in models",
    editCollection: "Edit collection",
    editCollectionDescription: "Use this form to edit collection informations",
    nameOfCollection: "Name of collection",
    countries: "Countries",
    country: "Country",
    countriesListDescription: "Countries are used in models",
    editCountry: "Edit country",
    editCountryDescription: "Use this form to edit country informations",
    nameOfCountry: "Name of country",
    design: "Design",
    state: "State",
    model: "Model",
    models: "Models",
    nameOfModel: "Name of model",
    modelsListDescription: "Models are base entities to create a sofa",
    editModel: "Edit model",
    editModelDescription: "Use this form to edit model informations",
    code: "Code",
    extraSize: "Extra size",
    destinationCountry: "Destination country",
    revision: "Revision",
    lastUpdate: "Last update",
    editedBy: "Edited by",
    yes: "Yes",
    no: "No",
    notes: "Notes",
    makeACopy: "Make a copy",
    associateVersion: "Associate version",
    pleaseSpecifyVersion: "Please specify version",
    versionAlreadyAssociated: "Version already associated",
    areYouSureToRemoveVersion: "Are you sure to remove version '{0}'?",
    duplicate: "Duplicate",
    edit: "Edit",
    pleaseSaveTheModel: "Please save the model to continue",
    configurables: "Configurables",
    configurablesListDescription: "List of versions associated to models. Use Models registry to make new associations",
    nameOfConfigurable: "Name of configurable",
    addComponent: "Add component",
    editRole: "Edit role",
    editRoleDescription: "Use role to manage what an user can do in system",
    unableToExcludeDefaultArticle: "Unable to exclude an article marked as default",
    addArticleToComponent: "Add article to component {0}",
    selectByArticle: "Select by article",
    removeThisComponent: "Remove this component",
    addArticle: "Add article",
    confirmRemoveConfigurableComponent: "Do you want to remove {0}?",
    editConfigurable: "Edit configurable",
    editConfigurableDescription: "A configurable is the base object for a sofa customization. Use this area to design a model-version in all of its parts",
    noArticlesSelected: "No articles selected for component {0}",
    pleaseSelectDefaultArticleForComponent: "Please select default article for component {0}",
    invalidDefaultArticleSelectedForComponent: "Invalid default article selected for component {0}",
    accessories: "Accessories",
    accessoriesListDescription: "Accessories list",
    editAccessory: "Edit accessory",
    editAccessoryDescription: "Use this form to edit accessory informations",
    nameOfAccessory: "Name of accessory",
    unitOfMeasurements: "Unit of measurements",
    unitOfMeasurementsListDescription: "Unit of measurements list",
    shortName: "Short name",
    conversionFactor: "Conversion factor",
    status: "Status",
    quantity: "Quantity",
    remove: "Remove",
    unitOfMeasurement: "Unit of measurements",
    parts: "Parts",
    partsListDescription: "Represents a coverable part of a sofa",
    editPart: "Edit part",
    editPartDescription: "Use this form to edit part informations",
    nameOfPart: "Name of part",
    covers: "Covers",
    addPart: "Add part",
    type: "Type",
    coverTypes: "Cover types",
    coverTypesListDescription: "Types of coverings used for cover sofa",
    nameOfCoverType: "Name of cover type",
    editCoverType: "Edit cover type",
    editCoverTypeDescription: "Use this form to edit cover type informations",
    colors: "Colors",
    colorsListDescription: "List of colors used in your systems",
    nameOfColor: "Name of color",
    editColor: "Edit color",
    editColorDescription: "Use this form to edit color informations",
    removeThisPart: "Remove this part",
    coverOptions: "Cover options",
    addCoverOption: "Add cover option",
    removeThisCoverOption: "Remove this cover option",
    analogousColorArticles: "Analogous articles",
    complementaryColorArticles: "Complementary articles",
    addComplementaryArticleToCoverOption: "Add complementary article to cover option {0}",
    addAnalogousArticleToCoverOption: "Add analogous article to cover option {0}",
    coverType: "Cover type",
    color: "Color",
    characteristicsDisabledForCoverOptions: "Characteristics disabled for cover options",
    compositions: "Compositions",
    customers: "Customers",
    customersListDescription: "Create system customers",
    paymentCode: "Payment code",
    fiscalCode: "Fiscal code",
    editCustomer: "Edit customer",
    firstName: "First name",
    lastName: "Last name",
    companyName: "Company name",
    cityCode: "City code",
    countryCode: "Country code",
    tel1: "Telephonic number 1",
    tel2: "Telephonic number 2",
    fax: "Fax",
    cellNumber: "Cellular number",
    pec: "Pec",
    vatCode: "Vat",
    componentsAccessoriesCovers: "Components accessories covers",
    removeThisPhase: "Remove this phase",
    phases: "Phases",
    addPhase: "Add phase",
    addComponentToPhase: "Add component to phase",
    workingTime: "Working time",
    address: "Address",
    phasesListDescription: "Phases list description",
    defaultTime: "default time",
    editPhase: "Edit phase",
    editPhaseDescription: "Edit phase description",
    nameOfPhase: "Name of phase",
    production: "Production",
    customer: "Customer",
    coverings: "Coverings",
    allCoverings: "All coverings",
    allAccessories: "All accessories",
    confirmRemoveConfigurablePhase: "Confirm remove configurable phase",
    addArticleToPart: "Add article to part",
    email: "Email",
    website: "Web site",
    zipCode: "Zip code",
    city: "City",
    coverOptionColorConfiguration: "Cover option color configuration",
    addComplementaryArticleForColor: "Add complementary article for {0}",
    addAnalogousArticleForColor: "Add analogous article for {0}"
}

strings["it"] = {
    appName: "_APPNAME_",
    registering: "Registrazione...",
    ooops: "Ooops...",
    badLogin: "Non riesco ad accedere! Per favore controlla il tuo indirizzo email o password!",
    welcome: "Benvenuto",
    congratulations: "Congratulazioni",
    welcomeMessage: "Ciao {0}, la tua registrazione è completa.\nUn link per la conferma è stato inviato a {1}.\nPer favore conferma prima di effettuare l'accesso",
    continue: "Continuare",
    register: "Registrati",
    forgotPassword: "Dimenticato la password",
    signIn: "Rgistrati",
    mailAddress: "Indirizzo mail",
    name: "Nome",
    password: "Password",
    accountConfirmText: "Inserisci il codice di attivazione che abbiamo inviato alla tua casella mail per confermare il tuo account",
    accountConfirmed: "Il tuo account è confermato. Puoi effettuare l'accesso ora",
    mailAndPasswordRequired: "Email e password sono richieste",
    nameMailAndPasswordRequired: "Nome, email e password sono richieste",
    mailRequired: "Email è richiesta",
    activationCodeRequired: "Codice di attivazione richiesto",
    accountRecoverText: "Per favore inserisci il tuo indirizzo email per recuperare la password. Ti invieremo una nuova password al tuo indirizzo mail!",
    problemOccoured: "C'è un problema",
    accountRecovered: "Una nuova password è stata inviata a {0}",
    pleaseSpecifyId: "Per favore specifica il tuo ID",
    pleaseSpecifyQuery: "Per favore specifica la domanda",
    pleaseSpecifyEntity: "Per favore specifica l'entità",
    search: "Ricerca",
    close: "Chiudi",
    selectFilterType: "Seleziona il tipo di filtro",
    filterType: "Tipo di filtro",
    typeValueToSearch: "Tipo di valore da cercare",
    value: "Valore",
    filters: "Filtri",
    pagination: "Mostrando {0} di {1} di {2}",
    noResults: "Non ci sono risultati con i criteri specificati",
    selectAll: "Seleziona tutto",
    delete: "Rimuovi",
    create: "Crea",
    refresh: "Ricarica",
    confirm: "Conferma",
    entityDeleteConfirm: "Sei sicuro di voler eliminare {0} entità?",
    submit: "Invia",
    cancel: "Annulla",
    add: "Aggiungi",
    pleaseSpecifyData: "Per favore specifica la data",
    ok: "OK",
    security: "Securezza",
    users: "Utenti",
    roles: "Ruoli",
    setup: "Setup",
    categories: "Categorie",
    nElementsSelected: "{0} elementi selezionati",
    oneElementSelected: "1 elemento selezionato",
    nothingSelected: "Niente selezionato",
    usersListDescription: "Creare, modificare o eliminare gli utenti di sistema",
    mail: "Email",
    active: "Attivo",
    editUser: "Modifica utente",
    editUserDescription: "Usa questo modulo per modificare le informazioni dell'utente",
    generalInformations: "Informazioni generali",
    rolesListDescription: "Un ruolo è un'entità che da all'utente l'autorizzazione per fare qualcosa",
    nameOfRole: "Nome del ruolo",
    role: "Ruolo",
    permissions: "Permessi",
    selectPermissions: "Seleziona i premessi per il ruolo",
    back: "Indietro",
    save: "Salva",
    image: "Immagine",
    cover: "Rivestimenti",
    saveComplete: "Salvataggio completato",
    articles: "Articoli",
    articlesListDescription: "Gli articoli devono essere presenti sul sistema Gamma. In commodo gli articoli vengono estesi per aggiungere funzionalità richiesta solo a Commodo",
    company: "Azienda",
    id: "ID",
    description: "Descrizione",
    companies: "Aziende",
    companiesListDescription: "Lista delle aziende, sola lettura!",
    components: "Componenti",
    componentsListDescription: "I componenti sono elementi base di una \"distinta di materiali\"",
    characteristic: "Caratteritica",
    characteristics: "Caratteristiche",
    nameOfComponent: "Nome del componente",
    editComponent: "Modifica componente",
    editComponentDescription: "Usa questo modulo per modificare le informazioni del componente",
    optionValue: "Valore di opzione",
    nameOfCharacteristic: "Nome della caratteristica",
    addCharacteristic: "Aggiungi caratteristica",
    newOption: "Nuova opzione",
    areYouSureToRemoveCharacteristic: "Sei sicuro di voler rimuovere la caratteristica '{0}'?",
    editArticle: "Modifica articolo",
    editArticleDescription: "Non tutte le informazini dell'articolo sono modificabili in Commodo perchè è connesso a TeamSystem Gamma",
    article: "Articolo",
    select: "Seleziona",
    component: "Componente",
    pleaseSpecifyComponentId: "Per favore specifica l'id del componente",
    pleaseSelectComponent: "Per favore seleziona il componente",
    characteristicValues: "Valori della caratteristica",
    selectedComponent: "Componente selezionato",
    noComponentSelected: "Nessun componente selezionato",
    versions: "Versioni",
    version: "Versione",
    versionsListDescription: "Usa le versioni per creare associazioni configurabili con i modelli",
    editVersion: "Modifica la versione",
    editVersionDescription: "Usa questo modulo per modificare le informazioni della versione",
    nameOfVersion: "Nome della versione",
    collections: "Collezioni",
    collection: "Collezione",
    collectionsListDescription: "Le collezioni sono usate nei modelli",
    editCollection: "Modifica collezioni",
    editCollectionDescription: "Usa questo modulo per modificare le informazioni delle collezioni",
    nameOfCollection: "Nome delle collezioni",
    countries: "Paesi",
    country: "Paese",
    countriesListDescription: "I paesi sono usati nei modelli",
    editCountry: "Modifica il paese",
    editCountryDescription: "Usa questo modulo per modificare le informazioni del paese",
    nameOfCountry: "Nome del paese",
    design: "Design",
    state: "Stato",
    model: "Modello",
    models: "Modelli",
    nameOfModel: "Nome del modello",
    modelsListDescription: "I modelli sono entità base per creare un divano",
    editModel: "Modifica modello",
    editModelDescription: "Usa questo modulo per modificare le informazioni del modello",
    code: "Codice",
    extraSize: "Extra size",
    destinationCountry: "Paese di destinazione",
    revision: "Revisione",
    lastUpdate: "Ultimo aggiornamento",
    editedBy: "Modificato da",
    yes: "Si",
    no: "No",
    notes: "Appunti",
    makeACopy: "Crea una copia",
    associateVersion: "Associa versione",
    pleaseSpecifyVersion: "Per favore specifica la versione",
    versionAlreadyAssociated: "Versione già associata",
    areYouSureToRemoveVersion: "Sei sicuro di voler rimuovere la versione '{0}'?",
    duplicate: "Duplica",
    edit: "Modifica",
    pleaseSaveTheModel: "Per favore salva il modello per continuare",
    configurables: "Configurabili",
    configurablesListDescription: "Lista delle versioni associate ai modelli. Usa il registro dei modelli per creare nuove associazioni",
    nameOfConfigurable: "Nome del configurabile",
    addComponent: "Aggiungi componente",
    editRole: "Modifica ruolo",
    editRoleDescription: "Usa un ruolo per gestire cosa può fare un utente nel sistema",
    unableToExcludeDefaultArticle: "Incapace di escludere un articolo contrassegnato come predefinito",
    addArticleToComponent: "Aggiungi articolo al componente {0}",
    selectByArticle: "Selezionare dall'articolo",
    removeThisComponent: "Rimuovi questo componente",
    addArticle: "Aggiungi articolo",
    confirmRemoveConfigurableComponent: "Desideri rimuovere {0}?",
    editConfigurable: "Modifica configurabile",
    editConfigurableDescription: "Un configurabile è l'oggetto base per la personalizzazione del divano. Usa quest'area per progettare un modello-versione in tutte le sue parti",
    noArticlesSelected: "Nessun artivolo selezionato per il componente {0}",
    pleaseSelectDefaultArticleForComponent: "Per favore seleziona l'articolo di default per il componente {0}",
    invalidDefaultArticleSelectedForComponent: "L'articolo di default invalido selezionato per il componente {0}",
    accessories: "Accessori",
    accessoriesListDescription: "Lista accessori",
    editAccessory: "Modifica accessori",
    editAccessoryDescription: "Usa questo modulo per modificare le informationi dell'accessorio",
    nameOfAccessory: "Nome dell'accessorio",
    unitOfMeasurements: "Unità di misura",
    unitOfMeasurementsListDescription: "Lista della unità di misura",
    shortName: "Nome breve",
    conversionFactor: "Fattore di conversione",
    status: "Stato",
    quantity: "Quantità",
    remove: "Rimuovi",
    unitOfMeasurement: "Unità di misura",
    parts: "Parti",
    partsListDescription: "Rappresenta una parte rivestibile di un divano",
    editPart: "Modifica parte",
    editPartDescription: "Usa questo modulo per modificare le informazioni della parte",
    nameOfPart: "Nome della parte",
    covers: "Rivestimenti",
    addPart: "Aggiungi parte",
    type: "Tipo",
    coverTypes: "Tipi di rivestimento",
    coverTypesListDescription: "Tipi di rivestimenti usati per rivestire il divano",
    nameOfCoverType: "Nome del tipo di rivestimento",
    editCoverType: "Modifica il tipo di rivestimento",
    editCoverTypeDescription: "Usa questo modulo per modificare il tipo di informazioni del rivestimento",
    colors: "Colori",
    colorsListDescription: "Lista dei colori utilizzati per i tuoi sistemi",
    nameOfColor: "Nome del colore",
    editColor: "Modifica colore",
    editColorDescription: "Usa questo modulo per modificare le informazioni del colore",
    removeThisPart: "Rimuovi questa parte",
    coverOptions: "Opzioni del rivestimento",
    addCoverOption: "Aggiungi opzione del rivestimento",
    removeThisCoverOption: "Rimuovi questa opzione del rivestimento",
    noArticlesSelected: "Nessun articolo selezionato",
    analogousColorArticles: "Articoli analoghi",
    complementaryColorArticles: "Articoli complementari",
    addComplementaryArticleToCoverOption: "Aggiungi articoli complementari per l'opzione del rivestimento {0}",
    addAnalogousArticleToCoverOption: "Aggiungi articoli analoghi per l'opzione del rivestimento {0}",
    coverType: "Tipo di rivestimento",
    color: "Colore",
    characteristicsDisabledForCoverOptions: "Caratteristiche disabilitate per le opzioni del rivestimento",
    compositions: "Composizioni",
    customers: "Clienti",
    customersListDescription: "Creare clienti del sistema",
    companyName: "Nome dell'Azienda",
    paymentCode: "Codice di pagamento",
    zipCode: "CAP",
    fiscalCode: "Codice fiscale",
    vatCode: "I.V.A.",
    componentsAccessoriesCovers: "Componenti dei rivestimenti degli accessori",
    removeThisPhase: "Rimuovi questa fase",
    phases: "Fasi",
    addPhase: "Aggiungi fase",
    addComponentToPhase: "Aggiungi componente alla fase",
    workingTime: "Tempo di lavoro",
    address: "Indirizzo",
    city: "Città",
    phasesListDescription: "Lista delle descrizioni della fase",
    defaultTime: "Tempo predefinito",
    editPhase: "Modifica fase",
    editPhaseDescription: "Modifica la descrizione della fase",
    nameOfPhase: "Nome della fase",
    production: "Produzione",
    customer: "Cliente",
    coverings: "Rivestimenti",
    allCoverings: "Tutti i rivestimenti",
    allAccessories: "Tutti gli accessori",
    confirmRemoveConfigurablePhase: "Conferma la rimozione della fase configurabile",
    coverOptionColorConfiguration: "Configurazione i colori dell'opzione rivestimento",
    addComplementaryArticleForColor: "Aggiungi articolo a contrasto a {0}",
    addAnalogousArticleForColor: "Aggiungi articolo a {0}",
    usersList: "Lista utenti",
    rolesList: "Lista ruoli"
}


export function setLanguage(language_) {
    language = language_
}

export function getLanguage() {
    return language
}

export default function M(key) {
    if (strings[language] && strings[language][key]) {
        return strings[language][key]
    } else {
        logger.w("String not found for language " + language + ":", key)
        return key
    }
}