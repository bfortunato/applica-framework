"use strict";

import { Screen, FullScreenLayout } from "utils/ui"

define("screens/login", (module, exports) => {

    class Login extends Screen {

        render() {
            return (
                <FullScreenLayout>
                    <div className="card">Test Screen</div>
                </FullScreenLayout>
            )
        }

    }

    module.exports = Login;

})