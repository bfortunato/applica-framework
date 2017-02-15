import {Index} from "./components/layout"
import Login from "./screens/login"
import Register from "./screens/register"
import Recover from "./screens/recover"
import Home from "./screens/home"
import RegistrationOk from "./screens/registrationOk"
import Confirm from "./screens/confirm"
import * as ui from "./utils/ui"
import * as plugins from "./pluginsimpl"
import {resumeSession, setupMenu} from "../actions"
import {SessionStore} from "../stores"
import {EntitiesGrid, EntityForm} from "./screens/entities"
import menu from "./menu"

/* Register plugins */
plugins.register()

/* Admin routes */
ui.addRoute("/admin/entities/:entity", params => ui.changeScreen(<EntitiesGrid key={params.entity} entity={params.entity} />))
ui.addRoute("/admin/entities/:entity/:entityId", params => ui.changeScreen(<EntityForm key={params.entity} entity={params.entity} entityId={params.entityId} />))
ui.addRoute("/admin/entities/:entity/new", params => ui.changeScreen(<EntityForm key={params.entity} entity={params.entity} />))


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

/* Setup menu voices */
setupMenu({menu})

/* Avoid going in screens that require login before trying session resume */
let owner = {}
SessionStore.subscribe(owner, state => {
    if (state.resumeComplete) {
        SessionStore.unsubscribe(owner)
        ui.startNavigation()
    }
})

/* automatic login, if possible */
resumeSession()
