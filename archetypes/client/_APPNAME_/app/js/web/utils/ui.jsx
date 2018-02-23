"use strict";

import M from "../../strings";
import {Observable} from "./events";
import {isControlPressed, isShiftPressed} from "./keyboard";


let router = new RouteRecognizer();
let base = null;
let lastFragment = null;
let veryLastFragment = null;
let screens = new Observable();
let beforeChangeListeners = [];
let routerDisabledNextTime = false;
let changeScreenConfirmEnabled = true


export function getUrlParameter(sParam) {
	let queryStringIndex = window.location.href.indexOf("?")
	if (queryStringIndex == -1) {
		return null
	}
    var sPageURL = decodeURIComponent(window.location.href.substring(queryStringIndex + 1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function _handleRoute(fragment) {
	let route = router.recognize(fragment);
	if (route) {
		let params = _.extend(route[0].params, route.queryParams || {});
		route[0].handler(params);
	}
}

function _clearSlashes(path) {
	return path.toString().replace(/\/$/, '').replace(/^\//, '');
}

exports.addRoute = function(path, handler) {
	router.add([{path: path, handler: handler}]);
};

exports.startNavigation = function(_base) {
	base = _base || "#";

	let loop = () => {
		let fragment = "/";
		if (location.href.indexOf("#") !== -1) {
			fragment = _clearSlashes(location.href.split("#")[1]);
		}

		if (lastFragment !== fragment) {
			veryLastFragment = lastFragment
			lastFragment = fragment;

			if (!routerDisabledNextTime) {
				_handleRoute(fragment);
			}

			routerDisabledNextTime = false
		}

		window.setTimeout(loop, 100);
	};

	loop();
};

exports.addQueryParam = function(param, value) {
    updateQueryStringParam(param, value)
};

function updateQueryStringParam (key, value) {

    let base = 	[location.protocol, '//', location.host, location.pathname].join("");
    if (location.href.indexOf("#") !== -1) {
        base = base + "#/" + _clearSlashes(location.href.split("#")[1].split("?")[0]);

    }
    let urlQueryString = location.href.split("?")[1];

    let newParams = key + '=' + value;
    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        urlQueryString.split("&").forEach(function(e, i) {
            if (e.split("=")[0] != key) {
                newParams = newParams + "&" + e;
            }
        })
    }
    base = base + "?" + newParams;

    history.replaceState({}, "", base);
}



exports.navigate = function(path, openInNewTab = false) {
	if (isShiftPressed()) {
		window.open(_clearSlashes(base + path)).focus()			
	} else if (isControlPressed() || openInNewTab) {
		$("<a>")
			.attr("href", _clearSlashes(base + path))
			.attr("target", "_blank")
			.get(0)
			.click()
	} else {
		history.pushState(null, null, _clearSlashes(base + path))
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }
};

exports.enableChangeScreenConfirm = function() {
	changeScreenConfirmEnabled = true
}

exports.disableChangeScreenConfirm = function() {
	changeScreenConfirmEnabled = false
}

exports.changeScreen = function(screen) {
	for (let i = 0; i < beforeChangeListeners.length; i++) {
		let listener = beforeChangeListeners[i]
		if (_.isFunction(listener)) {
			let out = listener()

			if (changeScreenConfirmEnabled) {
				if (out) {
					swal({title: M("confirm"), text: M("formChangeAlert"), showCancelButton: true})
						.then(() => {
							screens.invoke("screen.change", screen);
						})
						.catch(() => {
							if (!_.isEmpty(veryLastFragment)) {
								routerDisabledNextTime = true
								window.location.href = "#" + veryLastFragment
							}
						})

					return;
				}
			} else {
				screens.invoke("screen.change", screen);
			}
		}
	}	

	screens.invoke("screen.change", screen);
};

exports.addScreenChangeListener = function(listener) {
	screens.addListener("screen.change", listener);
};

exports.removeScreenChangeListener = function(listener) {
	screens.removeListener("screen.change", listener);
};

exports.addOnBeforeChangeListener = function(listener) {
	beforeChangeListeners.push(listener)
}

exports.removeOnBeforeChangeListener = function(listener) {
	beforeChangeListeners = _.filter(beforeChangeListeners, l => l !== listener)
}