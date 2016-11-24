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


const messages = {
    OK: "OK",
    ERROR: "Generic error",
    UNAUTHORIZED: "Unauthorized",
    ERROR_MAIL_ALREADY_EXISTS: "Mail already exists",
    ERROR_MAIL_NOT_FOUND: "Mail not found",
    ERROR_BAD_CREDENTIALS: "Bad mail or password",
    ERROR_TOKEN_GENERATION: "Error generating token",
    ERROR_TOKEN_FORMAT: "Bad token format",
    ERROR_MAIL_NOT_VALID: "Mail not valid",
    ERROR_PASSWORD_NOT_VALID: "Password not valid",
}

export function msg(code) {
    if (_.has(messages, code)) {
        return message[code]
    }

    return "Code: " + code
}