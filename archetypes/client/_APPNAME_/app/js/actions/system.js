"use strict"

import {SYSTEM_INFORMATIONS} from "./types";
import {createAsyncAction} from "../utils/ajex";
import * as SystemApi from "../api/system";
import * as config from "../config";

export const systemInformation = createAsyncAction(SYSTEM_INFORMATIONS, data => {

    SystemApi.getSystemInfos()
        .then(response => {
            let systemInfos = {}
            systemInfos.backendVersion = config.backendVersion
            systemInfos.apiVersion = response.value.apiVersion
            systemInfos.copyrightInfos = config.copyrightInfos
            systemInformation.complete(systemInfos)
        })
        .catch(e => {
        })

});