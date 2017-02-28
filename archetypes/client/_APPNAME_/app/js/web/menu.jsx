import M from "../strings"

export default [
    {
        icon: "zmdi zmdi-shield-security",
        text: M("security"),
        children: [
            {
                icon: "zmdi zmdi-accounts-alt",
                text: M("users"),
                href: "/#/entities/user?grid=users"
            },
            {
                icon: "zmdi zmdi-key",
                text: M("roles"),
                href: "/#/entities/role?grid=roles"
            }
        ]
    },
    {
        icon: "zmdi zmdi-wrench",
        text: M("setup"),
        children: [
            {
                icon: "zmdi zmdi-labels",
                text: M("categories"),
                href: "/#/entities/category?grid=categories"
            }
        ]
    }
]