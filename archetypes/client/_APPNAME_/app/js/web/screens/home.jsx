import React from "react";
const { Screen, Layout } = require("../components/layout")
const Secure = require("../components/secure")

export default class Home extends Screen {
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

