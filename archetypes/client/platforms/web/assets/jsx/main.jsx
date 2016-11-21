import { Index } from "components/layout"
import Login from "screens/login"
import Register from "screens/register"
import Recover from "screens/recover"
import Home from "screens/home"
import * as ui from "utils/ui"

/* Login routes */
ui.addRoute("/login", params => ui.changeScreen(<Login />))
ui.addRoute("/register", params => ui.changeScreen(<Register />))
ui.addRoute("/recover", params => ui.changeScreen(<Recover />))

/* home route */
ui.addRoute("/", params => ui.changeScreen(<Home />))

ReactDOM.render(<Index />, document.getElementById("entry-point"))

ui.startNavigation()