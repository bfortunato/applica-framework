export const OK                              = 0;
export const ERROR                           = 1;
export const UNAUTHORIZED                    = 2;

export const ERROR_MAIL_ALREADY_EXISTS       = 1001;
export const ERROR_MAIL_NOT_FOUND            = 1002;
export const ERROR_BAD_CREDENTIALS           = 1003;
export const ERROR_TOKEN_GENERATION          = 1004;
export const ERROR_TOKEN_FORMAT              = 1005;
export const ERROR_MAIL_NOT_VALID            = 1006;
export const ERROR_PASSWORD_NOT_VALID        = 1007;
export const ERROR_VALIDATION                = 1008;



const messages = {}
messages[OK] = "OK"
messages[ERROR] = "Generic error"
messages[UNAUTHORIZED] = "Unauthorized"
messages[ERROR_MAIL_ALREADY_EXISTS] = "Mail already exists"
messages[ERROR_MAIL_NOT_FOUND] = "Mail not found"
messages[ERROR_BAD_CREDENTIALS] = "Bad mail or password"
messages[ERROR_TOKEN_GENERATION] = "Error generating token"
messages[ERROR_TOKEN_FORMAT] = "Bad token format"
messages[ERROR_MAIL_NOT_VALID] = "Mail not valid"
messages[ERROR_PASSWORD_NOT_VALID] = "Password not valid"
messages[ERROR_VALIDATION] = "Please check your data and try again"

export function msg(code) {
    if (_.has(messages, code)) {
        return messages[code]
    }

    return "Code: = " + code
}