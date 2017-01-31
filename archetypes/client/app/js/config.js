var serviceBase = "http://localhost:8080/";

module.exports = {
    "service.url": `${serviceBase}`,
    "login.url": `${serviceBase}auth/login`,
    "account.url": `${serviceBase}account`,
    "account.register.url": `${serviceBase}account/register`,
    "account.recover.url": `${serviceBase}account/recover`,
    "account.reset.url": `${serviceBase}account/reset`,
    "account.confirm.url": `${serviceBase}account/confirm`,
    "grids.url": `${serviceBase}grids`,
    "entities.url": `${serviceBase}entities`,
    "entities.delete.url": `${serviceBase}entities/delete`,
    "values.permissions.url": `${serviceBase}values/permissions`
}