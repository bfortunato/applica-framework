"use strict"

import {TextCell, CheckCell} from "./components/grids"
import {check, sanitize} from "../libs/validator"
import {Text, Mail, Check, Image} from "./components/forms"
import {EntitiesLookupContainer, ValuesLookupContainer} from "./components/containers"
import strings from "../strings"


const entities = {
	user: {
		grid: {
			title: strings.usersList,
			subtitle: strings.usersListDescription,
			descriptor: {
	            columns: [
	                {property: "name", header: strings.name, cell: TextCell, sortable: true, searchable: true},
	                {property: "mail", header: strings.mail, cell: TextCell, sortable: true, searchable: true},
	                {property: "active", header: strings.active, cell: CheckCell, sortable: true, searchable: true}
	            ]
	        }
		},
		form: {
			title: strings.editUser,
			subtitle: strings.editUserDescription,
			descriptor: {
	            areas: [
	                {
	                    title: strings.generalInformations,
	                    subtitle: null,
	                    fields: [
	                        {
	                            property: "name",
	                            control: Text,
	                            label: strings.name,
	                            placeholder: strings.name,
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).notEmpty()
	                        },
	                        {
	                            property: "mail",
	                            control: Mail,
	                            label: strings.mail,
	                            placeholder: strings.mailAddress,
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).isEmail()
	                        },
	                        {
	                            property: "active",
	                            control: Check,
	                            label: strings.active,
	                            sanitizer: (value) => sanitize(value).toBoolean()
	                        },
							{
								property: "_image",
								control: Image,
								label: strings.image
							},
	                        {
	                            property: "roles",
	                            label: strings.roles,
	                            control: EntitiesLookupContainer,
	                            props: {
	                            	id: "user_roles",
	                            	mode: "multiple",
	                            	entity: "role",
		                            selectionGrid: {
		                                columns: [
		                                    {property: "role", header: strings.name, cell: TextCell}
		                                ]
		                            },
		                            popupGrid: {
		                                columns: [
		                                    {property: "role", header: strings.name, cell: TextCell}
		                                ]
		                            }
	                            }	                            
	                        }
	                    ]
	                }
	            ]
	        }
		}
	},


	role: {
		grid: {
			title: strings.rolesList,
			subtitle: strings.rolesListDescription,
			descriptor: {
				columns: [
	                {property: "role", header: "Role", cell: TextCell, sortable: true, searchable: true}
	            ]
			}
		},
		form: {
			title: "Edit role",
			subtitle: null,
			descriptor: {
				fields: [
					{
                        property: "role",
                        control: Text,
                        label: strings.role,
                        placeholder: strings.nameOfRole,
                        sanitizer: value => sanitize(value).trim(),
                        validator: value => check(value).notEmpty()
                    },
                    {
                    	property: "_permissions",
                    	label: strings.permissions,
                    	placeholder: strings.selectPermissions,
                    	control: ValuesLookupContainer,
                    	//sanitizer: value => _.map(value, v => v.value),
                    	validator: value => check(value).notEmpty(),
                    	props: {
                    		id: "role_permissions",
                    		collection: "permissions",
	                    	mode: "multiple",
	                        selectionGrid: {
	                            columns: [
	                                {property: "label", header: strings.name, cell: TextCell}
	                            ]
	                        },
	                        popupGrid: {
	                            columns: [
	                                {property: "label", header: strings.name, cell: TextCell}
	                            ]
	                        }
                    	}

                    }
				]
			}
		}
	}
}

export default entities