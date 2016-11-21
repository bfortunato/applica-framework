import * as types from "./types"
import * as aj from "../aj"

export const getMessage = aj.createAction(types.GET_MESSAGE, data => {
    aj.dispatch({
        type: types.GET_MESSAGE,
        message: "Hello World"
    })
});


export const showLoading = aj.createAction(types.SHOW_LOADING, data => {
    aj.dispatch({
        type: types.SHOW_LOADING,
        loading: true
    })
});


export const hideLoading = aj.createAction(types.HIDE_LOADING, data => {
    aj.dispatch({
        type: types.HIDE_LOADING,
        loading: false
    })
});