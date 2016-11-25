var serviceBase = "http://localhost:8080/";

module.exports = {
    "service.url": `${serviceBase}`,
    "login.url": `${serviceBase}auth/login`,
    "account.register.url": `${serviceBase}account/register`,
    "account.recover.url": `${serviceBase}account/recover`,
    "account.confirm.url": `${serviceBase}account/confirm`
};