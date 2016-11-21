alert("main");

import { Index } from "components/index"
import Login from "screens/login"
import * as ui from "utils/ui"

ReactDOM.render(<Index />, document.getElementById("entry-point"))

ui.addRoute("login", params => ui.changeScreen(<Login />))
