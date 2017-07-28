"use strict";

const M = require("../../strings").default

const { Observable } = require("./events");

let router = new RouteRecognizer();
let base = null;
let lastFragment = null;
let veryLastFragment = null;
let screens = new Observable();
let beforeChangeListeners = [];
let routerDisabledNextTime = false;

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

exports.navigate = function(path) {
	history.pushState(null, null, _clearSlashes(base + path));
};

exports.changeScreen = function(screen) {
	for (let i = 0; i < beforeChangeListeners.length; i++) {
		let listener = beforeChangeListeners[i]
		if (_.isFunction(listener)) {
			let out = listener()

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