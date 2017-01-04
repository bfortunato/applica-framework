var serviceBase = "http://localhost:8080/";

module.exports = {
    "service.url": `${serviceBase}`,
    "login.url": `${serviceBase}auth/login`,
    "account.register.url": `${serviceBase}account/register`,
    "account.recover.url": `${serviceBase}account/recover`,
    "account.reset.url": `${serviceBase}account/reset`,
    "grids.url": `${serviceBase}grids`,
    "entities.url": `${serviceBase}entities`,
    "values.permissions.url": `${serviceBase}values/permissions`
}