"use strict";

import * as config from "../framework/config";
import {get, post} from "./utils";

export function register(name, mail, password) {
    return post(config.get("account.register.url"), {name, mail, password})
}

export function recover(mail) {
    return post(config.get("account.recover.url"), {mail})
}

export function confirm(activationCode) {
    return post(config.get("account.confirm.url"), {activationCode})
}

export function getCoverImage(userId) {
    return get(`${config.get("account.url")}/${userId}/cover`)
}

export function getProfileImage(userId) {
    return get(`${config.get("account.url")}/${userId}/profile/image`)
}

export function changePassword(password, passwordConfirm) {
    return post(config.get("account.url") + "/changePassword", {password: password ? password: "", passwordConfirm: passwordConfirm ? passwordConfirm : ""});
}

export function resetUserPassword(id) {
    return post(config.get("account.resetUserPassword.url"), {id})
}

export function requestRecoveryCode(mail) {
    return post(config.get("account.requestRecoveryCode.url"), {mail})
}

export function validateRecoveryCode(mail, code) {
    return post(config.get("account.validateRecoveryCode.url"), {mail, code})
}

export function resetPassword(mail, code, password, passwordConfirm) {
    return post(config.get("account.resetPassword.url"), {mail, code, password, passwordConfirm})
}



