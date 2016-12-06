var serviceBase = "http://192.168.1.188:8080/";

module.exports = {
    "service.url": `${serviceBase}`,
    "login.url": `${serviceBase}auth/login`,
    "account.register.url": `${serviceBase}account/register`,
    "account.recover.url": `${serviceBase}account/recover`,
    "account.reset.url": `${serviceBase}account/reset`,
    "grids.url": `${serviceBase}grids`,
    "entities.url": `${serviceBase}entities`
}