import React from "react";
import ReactDOM from "react-dom";
import {Index} from "./components/layout";
import Login from "./screens/login";
import Register from "./screens/register";
import Recover from "./screens/recover";
import Home from "./screens/home";
import RegistrationOk from "./screens/registrationOk";
import Confirm from "./screens/confirm";
import * as ui from "./utils/ui";
import * as plugins from "./pluginsimpl";
import {resumeSession} from "../actions/session";
import * as keyboard from "./utils/keyboard";
import {SessionStore} from "../stores/session";
import {EntitiesGrid, EntityForm, RevisionGrid} from "./screens/entities";
import {hidePageLoader} from "./components/loader";


export default function main() {
	/* Register plugins */
	plugins.register()

	/* Admin routes */
	ui.addRoute("/entities/:entity", params => ui.changeScreen(<EntitiesGrid key={params.entity} entity={params.entity} />))
	ui.addRoute("/entities/:entity/:entityId", params => ui.changeScreen(<EntityForm key={params.entity} entity={params.entity} entityId={params.entityId} params={params}/>))
	ui.addRoute("/entities/single/:entity", params => ui.changeScreen(<EntityForm key={params.entity} entity={params.entity} entityId="_" params={params}/>))
	ui.addRoute("/revision/:entity/:entityId", params => ui.changeScreen(<RevisionGrid key={params.entity} entityId={params.entityId}  entity={params.entity} params={params} />))
	ui.addRoute("/recover", params => ui.changeScreen(<Recover />))

	/* Account routes */
	ui.addRoute("/login", params => ui.changeScreen(<Login />))
	ui.addRoute("/register", params => ui.changeScreen(<Register />))
	ui.addRoute("/recover", params => ui.changeScreen(<Recover />))
	ui.addRoute("/registrationComplete", params => ui.changeScreen(<RegistrationOk />))

	ui.addRoute("/confirm", params => ui.changeScreen(<Confirm activationCode={params.activationCode}/>))

	/* home route */
	ui.addRoute("/", params => ui.changeScreen(<Home />))

	/* Attach keyboard for global key bindings */
	keyboard.attach()

	/* render main index page into dom */
	ReactDOM.render(<Index />, document.getElementById("entry-point"))

	/* Avoid going in screens that require login before trying session resume */
	let owner = {}
	SessionStore.subscribe(owner, state => {
	    if (state.resumeComplete) {
	        SessionStore.unsubscribe(owner)
	        ui.startNavigation()
	        hidePageLoader()
	    }
	})

	/* automatic login, if possible */
	resumeSession()
}
