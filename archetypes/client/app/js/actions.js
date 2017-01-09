import * as aj from "./aj"
import { createAsyncAction, completed, failed } from "./utils/ajex"
import * as session from "./api/session"
import * as account from "./api/account"
import * as responses from "./api/responses"
import { alert, confirm, showLoader, hideLoader, toast } from "./plugins"
import { format } from "./utils/lang"
import strings from "./strings"
import * as GridsApi from "./api/grids"
import * as EntitiesApi from "./api/entities"
import * as ValuesApi from "./api/values"

export const LOGIN = "LOGIN";
export const login = createAsyncAction(LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(strings.problemOccoured, strings.mailAndPasswordRequired, "warning")
        return;
    }

    aj.dispatch({
        type: LOGIN
    })

    showLoader()
    session.start(data.mail, data.password)
        .then(user => {
            hideLoader()
            toast(strings.welcome + " " + user.name);

            login.complete({user})
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, strings.badLogin, "error")

            login.fail()
        })
});

export const RESUME_SESSION = "RESUME_SESSION"
export const resumeSession = createAsyncAction(RESUME_SESSION, data => {
    aj.dispatch({
        type: RESUME_SESSION
    })

    session.resume()
        .then(user => {
            hideLoader()
            toast(strings.welcome + " " + user.name);

            resumeSession.complete({user})
        })
        .catch(e => {
            hideLoader()

            resumeSession.fail()
        })
});

export const LOGOUT = "LOGOUT";
export const logout = aj.createAction(LOGOUT, data => {
    session.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});

export const REGISTER = "REGISTER";
export const register = createAsyncAction(REGISTER, data => {
    if (_.isEmpty(data.name) || _.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(strings.problemOccoured, strings.nameMailAndPasswordRequired, "warning")
        return;
    }

    aj.dispatch({
        type: REGISTER
    })

    showLoader(strings.registering)
    account.register(data.name, data.mail, data.password)
        .then(() => {
            hideLoader()

            let message = format(strings.welcomeMessage, data.name, data.mail)
            register.complete({name: data.name, mail: data.mail, message})
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, responses.msg(e), "error")

            register.fail()
        })
});

export const RECOVER_ACCOUNT = "RECOVER_ACCOUNT"
export const recoverAccount = createAsyncAction(RECOVER_ACCOUNT, data => {
    if (_.isEmpty(data.mail)) {
        alert(strings.problemOccoured, strings.mailRequired, "warning")
        return;
    }

    aj.dispatch({
        type: RECOVER_ACCOUNT,
    })

    showLoader()
    account.recover(data.mail)
        .then(() => {
            hideLoader()
            alert(strings.congratulations, format(strings.accountRecovered, data.mail))

            recoverAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, responses.msg(e), "error")

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
        alert(strings.problemOccoured, strings.activationCodeRequired, "warning")
        return;
    }

    aj.dispatch({
        type: CONFIRM_ACCOUNT,
    })

    showLoader()
    account.confirm(data.activationCode)
        .then(() => {
            hideLoader()
            alert(strings.congratulations, strings.accountConfirmed)

            confirmAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, responses.msg(e), "error")

            confirmAccount.fail()
        })
})


/** Grids actions **/
export const GET_GRID = "GET_GRID"
export const getGrid = createAsyncAction(GET_GRID, data => {
    if (_.isEmpty(data.id)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyId)
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
            alert(strings.ooops, responses.msg(e), "error")

            getGrid.fail()
        })
})


/** Entities **/

export const LOAD_ENTITIES = "LOAD_ENTITIES"
export const loadEntities = createAsyncAction(LOAD_ENTITIES, data => {
    if (_.isEmpty(data.entity)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: LOAD_ENTITIES,
        discriminator: data.discriminator
    })

    EntitiesApi.load(data.entity, !_.isEmpty(data.query) ? data.query : null)
        .then(response => {
            loadEntities.complete({result: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

            loadEntities.fail({discriminator: data.discriminator})
        })
})

export const DELETE_ENTITIES = "DELETE_ENTITIES"
export const deleteEntities = createAsyncAction(DELETE_ENTITIES, data => {
    if (_.isEmpty(data.entity)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
        return
    }

    if (_.isEmpty(data.ids)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyId)
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: DELETE_ENTITIES,
        discriminator: data.discriminator
    })

    EntitiesApi.delete_(data.entity, data.ids)
        .then(() => {
            deleteEntities.complete({discriminator: data.discriminator})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

            deleteEntities.fail({discriminator: data.discriminator})
        })
})

export const SAVE_ENTITY = "SAVE_ENTITY"
export const saveEntity = createAsyncAction(SAVE_ENTITY, data => {
    if (_.isEmpty(data.entity)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
        return
    }

    if (_.isEmpty(data.data)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyData)
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: SAVE_ENTITY,
        discriminator: data.discriminator
    })

    EntitiesApi.save(data.entity, data.data)
        .then(() => {
            saveEntity.complete({discriminator: data.discriminator})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

            saveEntity.fail({discriminator: data.discriminator})
        })
});

export const GET_ENTITY = "GET_ENTITY"
export const getEntity = createAsyncAction(GET_ENTITY, data => {
    if (_.isEmpty(data.entity)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
        return
    }

    if (_.isEmpty(data.id)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyId)
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_ENTITY,
        discriminator: data.discriminator
    })

    EntitiesApi.get(data.entity, data.id)
        .then(response => {
            getEntity.complete({data: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

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
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
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
            alert(strings.ooops, responses.msg(e), "error")

            getLookupResult.fail({discriminator: data.discriminator})
        })
})

export const GET_LOOKUP_VALUES = "GET_LOOKUP_VALUES"
export const getLookupValues = createAsyncAction(GET_LOOKUP_VALUES, data => {
    if (_.isEmpty(data.collection)) {
        alert(strings.problemOccoured, strings.pleaseSpecifyEntity)
        return
    }

    if (_.isEmpty(data.discriminator)) {
        throw new Error("Discriminator is required")
    }

    aj.dispatch({
        type: GET_LOOKUP_VALUES,
        discriminator: data.discriminator
    })

    logger.i(JSON.stringify(data))

    ValuesApi.load(data.collection, data.keyword)
        .then(response => {
            getLookupValues.complete({values: response.value, discriminator: data.discriminator})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

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
 * MENU ACTIONS
 */

export const SETUP_MENU = "SETUP_MENU"
export const setupMenu = aj.createAction(SETUP_MENU, data => {
    aj.dispatch({
        type: SETUP_MENU,
        menu: data.menu
    })
})

