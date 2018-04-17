import M from "../strings"

export default [
    {
        icon: "zmdi zmdi-shield-security",
        text: M("security"),
        roles: ["admin"],
        children: [
            {
                icon: "zmdi zmdi-accounts-alt",
                text: M("users"),
                href: "/#/entities/user?grid=users",
                permissions: ["user:list"]
            },
            {
                icon: "zmdi zmdi-key",
                text: M("roles"),
                href: "/#/entities/role?grid=roles",
                permissions: ["role:list"]
            }
        ]
    }
]