"use strict"

define("screens/home", (module, exports) => {

    const { Screen, Layout } = require("../components/layout")
    const Secure = require("../components/secure")

    class Home extends Screen {
        render() {
            return (
                <Secure>
                    <Layout>
                        <div className="card">
                            Home Screen
                        </div>
                    </Layout>
                </Secure>
            )
        }
    }

    module.exports = Home

})