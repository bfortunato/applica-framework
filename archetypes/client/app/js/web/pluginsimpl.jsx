"use strict";

exports.Alert = {
    alert(data) {
        let {title, message, type, callback} = data;
        let _callback = (v) => { if (_.isFunction(callback)) {  callback(v) } }
        swal({title, text: message, type}).then(() => _callback(true)).catch(() => _callback(false))
    },

    confirm(data) {
        let {title, message, callback} = data;
        let _callback = (v) => { if (_.isFunction(callback)) {  callback(v) } }
        swal({title, text: message, showCancelButton: true}).then(() => _callback(true)).catch(() => _callback(false))
    }
}

exports.Loader = {
    show(data) {
        $(".global-loader").find(".message").text(data.message).end().fadeIn(250)
    },

    hide() {
        $(".global-loader").fadeOut(250)
    }
}

exports.Toast = {
    show(data) {
        $.growl({
            message: data.message,
            url: ''
        }, {
            element: 'body',
            type: "inverse",
            allow_dismiss: true,
            placement: {
                from: "bottom",
                align: "center"
            },
            offset: {
                x: 20,
                y: 85
            },
            spacing: 10,
            z_index: 1031,
            delay: 2500,
            timer: 1000,
            url_target: '_blank',
            mouse_over: false,
            icon_type: 'class',
            template: '<div data-growl="container" class="alert" role="alert">' +
                        '<button type="button" class="close" data-growl="dismiss">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '<span class="sr-only">Close</span>' +
                        '</button>' +
                        '<span data-growl="icon"></span>' +
                        '<span data-growl="message"></span>' +
                        '<a href="#" data-growl="url"></a>' +
                        '</div>'
        });
    }
}

exports.register = function() {
    window.Alert = exports.Alert;
    window.Toast = exports.Toast;
    window.Loader = exports.Loader;
}

