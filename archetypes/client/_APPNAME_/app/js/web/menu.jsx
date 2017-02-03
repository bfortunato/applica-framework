import strings from "../strings"

export default [
    {
        icon: "zmdi zmdi-shield-security",
        text: strings.security,
        children: [
            {
                icon: "zmdi zmdi-accounts-alt",
                text: strings.users,
                href: "/#/admin/entities/user?grid=users"
            },
            {
                icon: "zmdi zmdi-key",
                text: strings.roles,
                href: "/#/admin/entities/role?grid=roles"
            }
        ]
    },
    {
        icon: "zmdi zmdi-wrench",
        text: strings.setup,
        children: [
            {
                icon: "zmdi zmdi-labels",
                text: strings.categories,
                href: "/#/admin/entities/category?grid=categories"
            }
        ]
    }
]