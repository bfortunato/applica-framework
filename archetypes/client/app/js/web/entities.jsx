"use strict"

import {Grid, TextCell, CheckCell, resultToGridData} from "./components/grids"
import {check, sanitize} from "../libs/validator"
import {Text, Mail, Check, Select, Image, Lookup, File, Control} from "./components/forms"
import {EntitiesLookupContainer, ValuesLookupContainer} from "./components/containers"
import * as datasource from "../utils/datasource"
import * as SessionApi from "../api/session"
import * as responses from "../api/responses"
import {use} from "../utils/lang"
import * as query from "../api/query"


const entities = {
	user: {
		grid: {
			title: "Users list",
			subtitle: "Create, edit or delete system users",
			descriptor: {
	            columns: [
	                {property: "name", header: "Name", cell: TextCell, sortable: true, searchable: true},
	                {property: "mail", header: "Mail", cell: TextCell, sortable: true, searchable: true},
	                {property: "active", header: "Active", cell: CheckCell, sortable: true, searchable: true}
	            ]
	        }
		},
		form: {
			title: "Edit user",
			subtitle: "Manage user properties",
			descriptor: {
	            areas: [
	                {
	                    title: "General informations",
	                    subtitle: "Insert all information about user",
	                    fields: [
	                        {
	                            property: "name",
	                            control: Text,
	                            label: "Name",
	                            placeholder: "Name",
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).notEmpty()
	                        },
	                        {
	                            property: "mail",
	                            control: Mail,
	                            label: "Mail",
	                            placeholder: "Mail",
	                            sanitizer: (value) => sanitize(value).trim(),
	                            validator: (value) => check(value).isEmail()
	                        },
	                        {
	                            property: "active",
	                            control: Check,
	                            label: "Active",
	                            placeholder: "Active",
	                            sanitizer: (value) => sanitize(value).toBoolean()
	                        },
	                        {
	                            property: "roles",
	                            label: "Roles",
	                            control: EntitiesLookupContainer,
	                            props: {
	                            	id: "user_roles",
	                            	mode: "multiple",
	                            	entity: "role",
		                            selectionGrid: {
		                                columns: [
		                                    {property: "role", header: "Name", cell: TextCell}
		                                ]
		                            },
		                            popupGrid: {
		                                columns: [
		                                    {property: "role", header: "Name", cell: TextCell}
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
			title: "Roles list",
			subtitle: "A role is an entity that gives to user authorization to do something",
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
                        label: "Role",
                        placeholder: "Name of role",
                        sanitizer: (value) => sanitize(value).trim(),
                        validator: (value) => check(value).notEmpty()
                    },
                    {
                    	property: "permissions",
                    	label: "Permissions",
                    	placeholder: "Select permissions for role",
                    	control: ValuesLookupContainer,
                    	props: {
                    		id: "role_permissions",
                    		collection: "permissions",
	                    	mode: "multiple",
	                        selectionGrid: {
	                            columns: [
	                                {property: "label", header: "Name", cell: TextCell}
	                            ]
	                        },
	                        popupGrid: {
	                            columns: [
	                                {property: "label", header: "Name", cell: TextCell}
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