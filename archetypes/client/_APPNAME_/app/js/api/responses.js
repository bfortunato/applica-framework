import _ from "underscore"
import {getLanguage} from "../strings";


export const OK                              = 0;
export const ERROR                           = 1;
export const UNAUTHORIZED                    = 2;

export const ERROR_MAIL_ALREADY_EXISTS                   = 1001
export const ERROR_MAIL_NOT_FOUND                        = 1002
export const ERROR_BAD_CREDENTIALS                       = 1003
export const ERROR_TOKEN_GENERATION                      = 1004
export const ERROR_TOKEN_FORMAT                          = 1005
export const ERROR_MAIL_NOT_VALID                        = 1006
export const ERROR_PASSWORD_NOT_VALID                    = 1007
export const ERROR_VALIDATION                            = 1008
export const ERROR_NOT_FOUND                             = 1009
export const ERROR_USER_NOT_FOUND                        = 1010
export const ERROR_CONSTRAINT_VIOLATION                  = 1011
export const ERROR_CONNECTOR                             = 1012
export const ERROR_ROLE_NOT_FOUND                        = 1013
export const ERROR_IO                                    = 1014
export const ERROR_INVALID_DATA                          = 1015
export const ERROR_ARTICLE_NOT_FOUND                     = 2001
export const ERROR_INVALID_DEFAULT_ARTICLE               = 2002
export const ERROR_USER_COMPANY_NOT_SETTED               = 2003
export const ERROR_COVER_COMPONENT_ALREADY_EXISTS        = 2004
export const ERROR_COVER_COMPONENT_NOT_CONFIGURED        = 2005
export const ERROR_CUSTOMER_NOT_FOUND                    = 3001
export const ERROR_WAREHOUSE_NOT_FOUND                   = 4001
export const ERROR_DOCUMENT_NOT_FOUND                    = 5001


const messages = {
	en: {},

	it: {}
}

messages["en"][OK]										    = "OK"
messages["en"][ERROR] 									    = "Generic error"
messages["en"][ERROR_MAIL_ALREADY_EXISTS]                   = "Cannot register: mail already exists"
messages["en"][ERROR_MAIL_NOT_FOUND]                        = "Mail not found"
messages["en"][ERROR_BAD_CREDENTIALS]                       = "Cannot login: bad username or password"
messages["en"][ERROR_TOKEN_GENERATION]                      = "Error generating token"
messages["en"][ERROR_TOKEN_FORMAT]                          = "Bat token format"
messages["en"][ERROR_MAIL_NOT_VALID]                        = "Invalid email"
messages["en"][ERROR_PASSWORD_NOT_VALID]                    = "Password not valid"
messages["en"][ERROR_VALIDATION]                            = "Validation error. Please control inserted data and retry"
messages["en"][ERROR_NOT_FOUND]                             = "Not found"
messages["en"][ERROR_USER_NOT_FOUND]                        = "User not found"
messages["en"][ERROR_CONSTRAINT_VIOLATION]                  = "Constraint violation"
messages["en"][ERROR_CONNECTOR]                             = "There is a problem retrieving data from Gamma"
messages["en"][ERROR_ROLE_NOT_FOUND]                        = "Role not found"
messages["en"][ERROR_IO]                                    = "IO error"
messages["en"][ERROR_INVALID_DATA]                          = "Invalid data"
messages["en"][ERROR_ARTICLE_NOT_FOUND]                     = "Article not found"
messages["en"][ERROR_INVALID_DEFAULT_ARTICLE]               = "Invalid default article"
messages["en"][ERROR_USER_COMPANY_NOT_SETTED]               = "User company not setted"
messages["en"][ERROR_COVER_COMPONENT_ALREADY_EXISTS]        = "Cover component already exists"
messages["en"][ERROR_COVER_COMPONENT_NOT_CONFIGURED]        = "Cover component not configured"
messages["en"][ERROR_CUSTOMER_NOT_FOUND]                    = "Customer not found"
messages["en"][ERROR_WAREHOUSE_NOT_FOUND]                   = "Warehouse not found"
messages["en"][ERROR_DOCUMENT_NOT_FOUND]                    = "Document not found"

messages["it"][OK]											= "OK"
messages["it"][ERROR] 										= "Si è verificato un errore"
messages["it"][ERROR_MAIL_ALREADY_EXISTS]                   = "Impossibile registrarsi: indirizzo email già presente"
messages["it"][ERROR_MAIL_NOT_FOUND]                        = "Mail non trovata"
messages["it"][ERROR_BAD_CREDENTIALS]                       = "Impossibile accedere: email o password errati"
messages["it"][ERROR_TOKEN_GENERATION]                      = "Errore durante la generazione del token"
messages["it"][ERROR_TOKEN_FORMAT]                          = "Formato del token non valido"
messages["it"][ERROR_MAIL_NOT_VALID]                        = "Email non valida"
messages["it"][ERROR_PASSWORD_NOT_VALID]                    = "Password non valida"
messages["it"][ERROR_VALIDATION]                            = "Errore di validazione: ricontrollare i dati inseriti e riprovare"
messages["it"][ERROR_NOT_FOUND]                             = "Non trovato"
messages["it"][ERROR_USER_NOT_FOUND]                        = "Utente non trovato"
messages["it"][ERROR_CONSTRAINT_VIOLATION]                  = "Impossibile proseguire. Esistono entità collegate che dipendono da questa entità"
messages["it"][ERROR_CONNECTOR]                             = "Problema durante la comunicazione con Gamma"
messages["it"][ERROR_ROLE_NOT_FOUND]                        = "Ruolo non trovato"
messages["it"][ERROR_IO]                                    = "IO error"
messages["it"][ERROR_INVALID_DATA]                          = "Dati non validi"
messages["it"][ERROR_ARTICLE_NOT_FOUND]                     = "Articolo non trovato"
messages["it"][ERROR_INVALID_DEFAULT_ARTICLE]               = "Articolo predefinito non trovato"
messages["it"][ERROR_USER_COMPANY_NOT_SETTED]               = "Azienda non configurata per l'utente corrente"
messages["it"][ERROR_COVER_COMPONENT_ALREADY_EXISTS]        = "Componente di tipo rivestimento già presente"
messages["it"][ERROR_COVER_COMPONENT_NOT_CONFIGURED]        = "Componente di tipo rivestimento non trovato"
messages["it"][ERROR_CUSTOMER_NOT_FOUND]                    = "Cliente non trovato"
messages["it"][ERROR_WAREHOUSE_NOT_FOUND]                   = "Magazzino non trovato"
messages["it"][ERROR_DOCUMENT_NOT_FOUND]                    = "Documento non trovato"

export function msg(response) {
	let responseCode = null;

	if (typeof(response) === "object") {
	    if (response.message)
	        return response.message;

	    responseCode = response.responseCode;
	} else {
		responseCode = response;
	}

 	if (_.has(messages[getLanguage()], responseCode )) {
        return messages[getLanguage()][responseCode]
    }

    return "Errore n. " + responseCode
}

/**
 * Returns value of value responses. If o is a promise, a wrapped promise thar returns value will be returned
 */
export function value(o) {
	if (o instanceof Promise) {
		return new Promise((resolve, reject) => {
			o
				.then(result => {
					resolve(result.value)
				})
				.catch(e => reject(e))
		})		
	} else {
		if (_.isObject(o)) {
			return o.value
		}
	}

	logger.w(o, "is not a value response")

	return null
}