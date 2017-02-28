"use strict"

import * as aj from "../aj"
import { createAsyncAction, completed, failed } from "../utils/ajex"
import * as SessionApi from "../api/session"
import * as AccountApi from "../api/account"
import * as responses from "../api/responses"
import { alert, confirm, showLoader, hideLoader, toast } from "../plugins"
import { format } from "../utils/lang"
import M from "../strings"
import * as GridsApi from "../api/grids"
import * as EntitiesApi from "../api/entities"
import * as ValuesApi from "../api/values"

export const LOGIN = "LOGIN";
export const login = createAsyncAction(LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(M("problemOccoured"), M("mailAndPasswordRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: LOGIN
    })

    showLoader()
    SessionApi.start(data.mail, data.password)
        .then(user => {
            hideLoader()
            toast(M("welcome") + " " + user.name);

            login.complete({user})

            getUserProfileImage()
            getUserCoverImage()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), M("badLogin"), "error")

            login.fail()
        })
});

export const RESUME_SESSION = "RESUME_SESSION"
export const resumeSession = createAsyncAction(RESUME_SESSION, data => {
    aj.dispatch({
        type: RESUME_SESSION
    })

    SessionApi.resume()
        .then(user => {
            hideLoader()
            toast(M("welcome") + " " + user.name);

            resumeSession.complete({user})
            getUserProfileImage()
            getUserCoverImage()
        })
        .catch(e => {
            hideLoader()

            resumeSession.fail()
        })
});

export const LOGOUT = "LOGOUT";
export const logout = aj.createAction(LOGOUT, data => {
    SessionApi.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});

export const REGISTER = "REGISTER";
export const register = createAsyncAction(REGISTER, data => {
    if (_.isEmpty(data.name) || _.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(M("problemOccoured"), M("nameMailAndPasswordRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: REGISTER
    })

    showLoader(M("registering"))
    AccountApi.register(data.name, data.mail, data.password)
        .then(() => {
            hideLoader()

            let message = format(M("welcomeMessage"), data.name, data.mail)
            register.complete({name: data.name, mail: data.mail, message})
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            register.fail()
        })
});

export const RECOVER_ACCOUNT = "RECOVER_ACCOUNT"
export const recoverAccount = createAsyncAction(RECOVER_ACCOUNT, data => {
    if (_.isEmpty(data.mail)) {
        alert(M("problemOccoured"), M("mailRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: RECOVER_ACCOUNT,
    })

    showLoader()
    AccountApi.recover(data.mail)
        .then(() => {
            hideLoader()
            alert(M("congratulations"), format(M("accountRecovered"), data.mail))

            recoverAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            recoverAccount.fail()
        })
})

export const SET_ACTIVATION_CODE = "SET_ACTIVATION_CODE"
export const setActivationCode = aj.createAction(SET_ACTIVATION_CODE, data => {
    aj.dispatch({
        type: SET_ACTIVATION_CODE,
        activationCode: data.activationCode
    })
})

export const CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT"
export const confirmAccount = createAsyncAction(CONFIRM_ACCOUNT, data => {
    if (_.isEmpty(data.activationCode)) {
        alert(M("problemOccoured"), M("activationCodeRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: CONFIRM_ACCOUNT,
    })

    showLoader()
    AccountApi.confirm(data.activationCode)
        .then(() => {
            hideLoader()
            alert(M("congratulations"), M("accountConfirmed"))

            confirmAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            confirmAccount.fail()
        })
})


/** Grids actions **/
export const GET_GRID = "GET_GRID"
export const getGrid = createAsyncAction(GET_GRID, data => {
    if (_.isEmpty(data.id)) {
        alert(M("problemOccoured"), M("pleaseSpecifyId"))
        return
    }

    aj.dispatch({
        type: GET_GRID
    })

    showLoader()
    GridsApi.getGrid(data.id)
        .then(response => {
            hideLoader()

            getGrid.complete({grid: JSON.parse(response.value)})
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            getGrid.fail()
        })
})


/** Entities **/

let queries = {}

export const LOAD_ENTITIES = "LOAD_ENTITIES"
export const loadEntities = createAsyncAction(LOAD_ENTITIES, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    showLoader()
    aj.dispatch({
        type: LOAD_ENTITIES,
        discriminator: data.discriminator
    })

    let query = !_.isEmpty(data.query) ? data.query : null
    queries[data.entity] = query

    EntitiesApi.load(data.entity, query)
        .then(response => {
            hideLoader()
            loadEntities.complete({result: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            loadEntities.fail({discriminator: data.discriminator})
        })
})

export const DELETE_ENTITIES = "DELETE_ENTITIES"
export const deleteEntities = createAsyncAction(DELETE_ENTITIES, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.ids)) {
        alert(M("problemOccoured"), M("pleaseSpecifyId"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    showLoader()
    aj.dispatch({
        type: DELETE_ENTITIES,
        discriminator: data.discriminator
    })

    EntitiesApi.delete_(data.entity, data.ids)
        .then(() => {
            hideLoader()
            deleteEntities.complete({discriminator: data.discriminator})

            if (_.has(queries, data.entity)) {
                loadEntities({discriminator: data.discriminator, entity: data.entity, query: queries[data.entity]})
            }
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            deleteEntities.fail({discriminator: data.discriminator})
        })
})

export const SAVE_ENTITY = "SAVE_ENTITY"
export const saveEntity = createAsyncAction(SAVE_ENTITY, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.data)) {
        alert(M("problemOccoured"), M("pleaseSpecifyData"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    showLoader()
    aj.dispatch({
        type: SAVE_ENTITY,
        discriminator: data.discriminator
    })

    EntitiesApi.save(data.entity, data.data)
        .then(() => {
            hideLoader()
            toast(M("saveComplete"))

            saveEntity.complete({discriminator: data.discriminator, data: data.data})

            if (data.entity == "user") {
                if (SessionApi.getLoggedUser() != null && SessionApi.getLoggedUser().id == data.data.id) {
                    getUserProfileImage()
                    getUserCoverImage()
                }
            }
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            saveEntity.fail({discriminator: data.discriminator, data: data.data})
        })
});

export const NEW_ENTITY = "NEW_ENTITY"
export const newEntity = aj.createAction(NEW_ENTITY, data => {
    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: NEW_ENTITY,
        discriminator: data.discriminator
    })
})

export const GET_ENTITY = "GET_ENTITY"
export const getEntity = createAsyncAction(GET_ENTITY, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.id)) {
        alert(M("problemOccoured"), M("pleaseSpecifyId"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    showLoader()
    aj.dispatch({
        type: GET_ENTITY,
        discriminator: data.discriminator
    })

    EntitiesApi.get(data.entity, data.id)
        .then(response => {
            hideLoader()
            getEntity.complete({data: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            getEntity.fail({discriminator: data.discriminator})
        })
})

export const FREE_ENTITIES = "FREE_ENTITIES"
export const freeEntities = aj.createAction(FREE_ENTITIES, data => {
    aj.dispatch({
        type: FREE_ENTITIES,
        discriminator: data.discriminator
    })
})


/**
 * LOOKUP ACTIONS
 */

export const GET_LOOKUP_RESULT = "GET_LOOKUP_RESULT"
export const getLookupResult = createAsyncAction(GET_LOOKUP_RESULT, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_LOOKUP_RESULT,
        discriminator: data.discriminator
    })

    EntitiesApi.load(data.entity, !_.isEmpty(data.query) ? data.query : null)
        .then(response => {
            getLookupResult.complete({result: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(M("ooops"), responses.msg(e), "error")

            getLookupResult.fail({discriminator: data.discriminator})
        })
})

export const GET_LOOKUP_VALUES = "GET_LOOKUP_VALUES"
export const getLookupValues = createAsyncAction(GET_LOOKUP_VALUES, data => {
    if (_.isEmpty(data.collection)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_LOOKUP_VALUES,
        discriminator: data.discriminator
    })

    ValuesApi.load(data.collection, data.keyword)
        .then(response => {
            getLookupValues.complete({values: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(M("ooops"), responses.msg(e), "error")

            getLookupValues.fail({discriminator: data.discriminator})
        })
})

export const FREE_LOOKUP = "FREE_LOOKUP"
export const freeLookup = aj.createAction(FREE_LOOKUP, data => {
    aj.dispatch({
        type: FREE_LOOKUP,
        discriminator: data.discriminator
    })
})


/**
 * SELECT ACTIONS
 */

export const GET_SELECT_ENTITIES = "GET_SELECT_ENTITIES"
export const getSelectEntities = createAsyncAction(GET_SELECT_ENTITIES, data => {
    if (_.isEmpty(data.entity)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_SELECT_ENTITIES,
        discriminator: data.discriminator
    })

    ValuesApi.loadEntities(data.entity, data.keyword)
        .then(response => {
            getSelectEntities.complete({entities: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(M("ooops"), responses.msg(e), "error")

            getSelectEntities.fail({discriminator: data.discriminator})
        })
})

export const GET_SELECT_VALUES = "GET_SELECT_VALUES"
export const getSelectValues = createAsyncAction(GET_SELECT_VALUES, data => {
    if (_.isEmpty(data.collection)) {
        alert(M("problemOccoured"), M("pleaseSpecifyEntity"))
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_SELECT_VALUES,
        discriminator: data.discriminator
    })

    ValuesApi.load(data.collection, data.keyword)
        .then(response => {
            getSelectValues.complete({values: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(M("ooops"), responses.msg(e), "error")

            getSelectValues.fail({discriminator: data.discriminator})
        })
})

export const FREE_SELECT = "FREE_SELECT"
export const freeSelect = aj.createAction(FREE_SELECT, data => {
    aj.dispatch({
        type: FREE_SELECT,
        discriminator: data.discriminator
    })
})


/**
 * MENU ACTIONS
 */

export const SETUP_MENU = "SETUP_MENU"
export const setupMenu = aj.createAction(SETUP_MENU, data => {
    aj.dispatch({
        type: SETUP_MENU,
        menu: data.menu
    })
})

export const SET_ACTIVE_MENU_ITEM = "SET_ACTIVE_MENU_ITEM"
export const setActiveMenuItem = aj.createAction(SET_ACTIVE_MENU_ITEM, data => {
    aj.dispatch({
        type: SET_ACTIVE_MENU_ITEM,
        item: data.item
    })
})

export const EXPAND_MENU_ITEM = "EXPAND_MENU_ITEM"
export const expandMenuItem = aj.createAction(EXPAND_MENU_ITEM, data => {
    aj.dispatch({
        type: EXPAND_MENU_ITEM,
        item: data.item
    })
})


/**
 UI Actions
 */

export const GET_USER_COVER_IMAGE = "GET_USER_COVER_IMAGE"
export const getUserCoverImage = createAsyncAction(GET_USER_COVER_IMAGE, data => {
    let user = SessionApi.getLoggedUser()
    if (user == null) {
        return
    }

    aj.dispatch({
        type: GET_USER_COVER_IMAGE
    })

    AccountApi.getCoverImage(user.id)
        .then(data => {
            getUserCoverImage.complete({data: data.value})
        })
        .catch(e => {
            getUserCoverImage.fail({e})
        })

})

export const GET_USER_PROFILE_IMAGE = "GET_USER_PROFILE_IMAGE"
export const getUserProfileImage = createAsyncAction(GET_USER_PROFILE_IMAGE, data => {
    let user = SessionApi.getLoggedUser()
    if (user == null) {
        return
    }

    aj.dispatch({
        type: GET_USER_PROFILE_IMAGE
    })

    AccountApi.getProfileImage(user.id)
        .then(data => {
            getUserProfileImage.complete({data: data.value})
        })
        .catch(e => {
            getUserProfileImage.fail({e})
        })
})