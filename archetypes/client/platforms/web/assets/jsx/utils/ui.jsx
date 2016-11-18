"use strict";

define(["layout", "events"], function(layout, events) {

	class Navigation extends events.Observable {
		constructor(pwd) {
			super();

			if (pwd != "applica") {
				throw new Error("Navigation is a singleton");
			}

			this.lastFragment = null;
			this.router = new RouteRecognizer();
		}

		static instance() {
			if (!Navigation.__instance) {
				Navigation.__instance = new Navigation("applica");
			}

			return Navigation.__instance;
		}

		addRoute(path, screen) {
			this.router.add([{path: path, handler: (params) => {
				this.invoke("navigate", screen, params);
			}}])
		}

		start(base) {
			this.base = base;

			var loop = () => {
				var fragment = "/";
				if (location.href.indexOf("#") != -1) {
					fragment = this._clearSlashes(location.href.split("#")[1]);
				}

				if (this.lastFragment != fragment) {
					this.lastFragment = fragment;
					this._handleRoute(fragment);
				}

				window.setTimeout(loop, 100);
			};

			loop();
		}

		navigate(path) {
			history.pushState(null, null, this._clearSlashes(this.base + path));
		}

		_handleRoute(fragment) {
			var route = this.router.recognize(fragment);
			if (route) {
				var params = _.extend(route[0].params, route.queryParams || {});
				route[0].handler(params);
			}
		}

		_clearSlashes(path) {
			return path.toString().replace(/\/$/, '').replace(/^\//, '');
		}
	}

	exports.addRoute = function(path, screen) {
		Navigation.instance().addRoute(path, screen);
	};

	exports.start = function(path, screen) {
		Navigation.instance().start();
	};

	exports.navigate = function(path) {
		Navigation.instance().navigate(path);
	};
});

