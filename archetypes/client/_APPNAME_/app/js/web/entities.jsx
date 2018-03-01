"use strict"

import {CheckCell, TextCell} from "./components/grids";
import {check, sanitize} from "../libs/validator";
import {Image, Mail, PasswordText, Text, YesNo} from "./components/forms";
import {EntitiesLookupContainer, ValuesLookupContainer} from "./components/containers";
import M from "../strings";


const entities = {
	user: {
		grid: {
			title: M("usersList"),
			subtitle: M("usersListDescription"),
			descriptor: {
	            columns: [
	                {property: "name", header: M("name"), cell: TextCell, sortable: true, searchable: true},
	                {property: "mail", header: M("mail"), cell: TextCell, sortable: true, searchable: true},
	                {property: "active", header: M("active"), cell: CheckCell, sortable: true, searchable: true}
	            ]
	        }
		},
		form: {
			title: M("editUser"),
			subtitle: M("editUserDescription"),
			descriptor: {
	            areas: [
	                {
	                    title: M("generalInformations"),
	                    subtitle: null,
	                    fields: [
	                        {
	                            property: "name",
	                            control: Text,
	                            label: M("name"),
	                            placeholder: M("name"),
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).notEmpty()
	                        },
	                        {
	                            property: "mail",
	                            control: Mail,
	                            label: M("mail"),
	                            placeholder: M("mailAddress"),
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).isEmail()
	                        },
                            {
                                property: "password",
                                control: PasswordText,
                                label: M("password"),
                                placeholder: M("password"),
                                sanitizer: value => sanitize(value).trim()
                            },

                            {
	                            property: "active",
	                            control: YesNo,
	                            label: M("active"),
	                            sanitizer: (value) => sanitize(value).toBoolean()
	                        },
							{
								property: "_image",
								control: Image,
								label: M("image")
							},
							{
								property: "_cover",
								control: Image,
								label: M("cover")
							},
	                        {
	                            property: "roles",
	                            label: M("roles"),
	                            control: EntitiesLookupContainer,
	                            props: {
	                            	id: "user_roles",
	                            	mode: "multiple",
	                            	entity: "role",
		                            selectionGrid: {
		                                columns: [
		                                    {property: "role", header: M("name"), cell: TextCell}
		                                ]
		                            },
		                            popupGrid: {
		                                columns: [
		                                    {property: "role", header: M("name"), cell: TextCell}
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
			title: M("rolesList"),
			subtitle: M("rolesListDescription"),
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
                        label: M("role"),
                        placeholder: M("nameOfRole"),
                        sanitizer: value => sanitize(value).trim(),
                        validator: value => check(value).notEmpty()
                    },
                    {
                    	property: "_permissions",
                    	label: M("permissions"),
                    	placeholder: M("selectPermissions"),
                    	control: ValuesLookupContainer,
                    	//sanitizer: value => _.map(value, v => v.value),
                    	validator: value => check(value).notEmpty(),
                    	props: {
                    		id: "role_permissions",
                    		collection: "permissions",
	                    	mode: "multiple",
	                        selectionGrid: {
	                            columns: [
	                                {property: "label", header: M("name"), cell: TextCell}
	                            ]
	                        },
	                        popupGrid: {
	                            columns: [
	                                {property: "label", header: M("name"), cell: TextCell}
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