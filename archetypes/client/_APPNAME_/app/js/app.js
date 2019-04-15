import "@babel/polyfill";
import "./web/ajweb";
import {createRuntime} from "./aj";
import "./stores/session";
import "./stores/account";
import "./stores/entities";
import "./stores/menu";
import "./stores/ui";
import "./actions/session";
import "./actions/entities";
import "./actions/menu";
import "./actions/ui";

global.main = function() {
	const runtime = createRuntime();

	if (platform.device == "browser") {
		const main = require("./web/main");

		main.default();
	}	

	return runtime;
}
