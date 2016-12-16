import { Index } from "./components/layout"
import Login from "./screens/login"
import Register from "./screens/register"
import Recover from "./screens/recover"
import Home from "./screens/home"
import RegistrationOk from "./screens/registrationOk"
import Confirm from "./screens/confirm"
import * as ui from "./utils/ui"
import * as plugins from "./pluginsimpl"
import { resumeSession } from "../actions"
import { EntityForm } from "./screens/admin"

function ifAdmin(fn, ...params) {
    if (true) {
        fn.apply(this, params)
    }
}

/* Register plugins */
plugins.register()

/* Admin routes */
ui.addRoute("/admin/entities/:entity/", params => ifAdmin(ui.changeScreen, <EntitiesGrid entity={params.entity} grid={params.grid} />))
ui.addRoute("/admin/entities/:entity/edit", params => ifAdmin(ui.changeScreen, <EntityForm entity={params.entity} form={params.form} />))

/* Account routes */
ui.addRoute("/login", params => ui.changeScreen(<Login />))
ui.addRoute("/register", params => ui.changeScreen(<Register />))
ui.addRoute("/recover", params => ui.changeScreen(<Recover />))
ui.addRoute("/registrationComplete", params => ui.changeScreen(<RegistrationOk />))
ui.addRoute("/confirm", params => ui.changeScreen(<Confirm activationCode={params.activationCode}/>))

/* home route */
ui.addRoute("/", params => ui.changeScreen(<Home />))

/* render main index page into dom */
ReactDOM.render(<Index />, document.getElementById("entry-point"))

/* automatic login, if possible */
resumeSession()

/* starts navigation demon */
ui.startNavigation()