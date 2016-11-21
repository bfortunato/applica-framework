"use strict"

define("screens/home", (module, exports) => {

    const { Screen, Layout } = require("../components/layout");

    class Home extends Screen {
        render() {
            return (
                <Layout>
                    <div className="card">
                        Home Screen
                    </div>
                </Layout>
            )
        }
    }

    module.exports = Home;

})