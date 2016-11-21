"use strict";

import { Observable } from "utils/events"

define("utils/ui", (module, exports) => {

	let router = new RouteRecognizer();
	let base = null;
	let lastFragment = null;
	let screens = new Observable();

	function _handleRoute(fragment) {
		var route = this.router.recognize(fragment);
		if (route) {
			var params = _.extend(route[0].params, route.queryParams || {});
			route[0].handler(params);
		}
	}

	function _clearSlashes(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	}

	exports.addRoute = function(path, handler) {
		router.add([{path: path, handler: handler}]);
	};

	exports.start = function(base) {
		base = base;

		var loop = () => {
			var fragment = "/";
			if (location.href.indexOf("#") != -1) {
				fragment = _clearSlashes(location.href.split("#")[1]);
			}

			if (lastFragment != fragment) {
				lastFragment = fragment;
				_handleRoute(fragment);
			}

			window.setTimeout(loop, 100);
		};

		loop();
	};

	exports.navigate = function(path) {
		history.pushState(null, null, this._clearSlashes(this.base + path));
	};

	exports.changeScreen = function(screen) {
		screens.invoke("screen.change", screen);
	};

	exports.addScreenChangeListener = function(listener) {
		screens.addListener("screen.change", listener);
	};

	exports.removeScreenChangeListener = function(listener) {
		screens.removeListener("screen.change", listener);
	};
});

