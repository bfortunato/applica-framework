"use strict"

import {CheckCell, TextCell} from "./components/grids";
import {check, sanitize} from "../libs/validator";
import {Image, Mail, PasswordText, Text, YesNo} from "./components/forms";
import {EntitiesLookupContainer, ValuesLookupContainer} from "./components/containers";
import M from "../strings";
import {getLoggedUser, hasPermission} from "../api/session";


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
			getActions(data) {
				let actions = ["back", "save", "save-go-back", "revisions"];
				if (hasPermission("canResetPassword")) {
					if (data && data.id) {
						actions.push({
							type: "button",
							icon: "zmdi zmdi-brush",
							tooltip: "Reset password",
							action: () => {

								swal({
									title: M("confirm"),
									text: "Verrà impostata una nuova password ed inviata all'indirizzo mail dell'utente",
									showCancelButton: true
								})
									.then(() => {
										resetUserPassword({id: data.id})
										if (data.id === getLoggedUser().id) {
											swal({
												title: M("confirm"),
												text: "La tua password è stata resettata. Dovrai eseguire un nuovo accesso",
												showCancelButton: false
											})
												.then(() => {
													logout();
													ui.navigate("/login")

												})
												.catch((e) => {
													logger.i(e)
												})
										}

									})
									.catch((e) => {
										logger.i(e)
									})

							}
						})
					}
				}
				return actions
			},
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

    // ,revisionSettings: {
    //     form: {
    //         title: M("entityRevisionSettings"),
    //         subtitle: null,
    //         descriptor: {
    //             canGoBack() {
    //                 return false
    //             },
    //             fields: [
    //                 {
    //                     property: "items",
    //                     control: MultiCheckboxByValue,
    //                     size: "col-xs-12",
    //                     props: {
    //                         formatter: v => {
    //                             return M(v.itemType)
    //                         }
    //                     }
    //                 },
    //             ]
    //         }
    //     }
    // },
    // revision: {
    //     grid: {
    //         title: M("revisions"),
    //         descriptor: {
    //             columns: [
    //                 {property: "code", header: M("code"), cell: TextCell, sortable: false, searchable: false},
    //                 {property: "type", header: M("type"), cell: TextCell, sortable: false, searchable: false},
    //                 {
    //                     property: "creator",
    //                     header: M("author"),
    //                     cell: TextCell,
    //                     sortable: false,
    //                     searchable: false
    //                 },
    //
    //                 {
    //                     property: "dateToString",
    //                     header: M("date"),
    //                     cell: TextCell,
    //                     sortable: false,
    //                     searchable: false
    //                 },
    //                 {
    //                     property: "differences",
    //                     header: M("differences"),
    //                     cell: MultiTextCell,
    //                     sortable: false,
    //                     searchable: false,
    //                     props: {
    //                         singleItemFormatter(v) {
    //                             debugger
    //                             let previousValueString = "";
    //                             let newValueString = "";
    //                             previousValueString = M("previousValue") + ": " + (v.previousValueDescription? v.previousValueDescription : " null ") + ", ";
    //                             newValueString = M("newValue") + ": " + (v.newValueDescription? v.newValueDescription : " null ");
    //                             return M(v.name) + " -> " + previousValueString + newValueString
    //                         }
    //                     }
    //                 }
    //
    //             ]
    //         }
    //     },
    // }
}

export default entities