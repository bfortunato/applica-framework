import _ from "underscore";

exports.Alert = {
    alert(data, callback) {
        let {title, message, type} = data;
        let _callback = (v) => { if (_.isFunction(callback)) {  callback(v) } }
        swal({title, text: message, type}).then((res) => _callback(res.value))
    },

    confirm(data, callback) {
        let {title, message} = data;
        let _callback = (v) => { if (_.isFunction(callback)) {  callback(v) } }
        swal({title, text: message, showCancelButton: true}).then((res) => _callback(res.value))
    }
}

let loaderCount = 0;
let unobtrusiveLoaderCount = 0;

exports.Loader = {
    show(data, callback) {
        loaderCount++
        $(".global-loader").find(".message").text(data.message).end().show()
    },

    hide(data, callback) {
        loaderCount--
        if (loaderCount <= 0) {
            $(".global-loader").hide()
            loaderCount = 0
        }
    },

    showUnobtrusive(data, callback) {
        unobtrusiveLoaderCount++
        $(".unobtrusive-loader").show()
        $(".hide-on-unobtrusive-loading").hide();
    },

    hideUnobtrusive(data, callback) {
        unobtrusiveLoaderCount--;
        if (unobtrusiveLoaderCount <= 0) {
            $(".unobtrusive-loader").hide()
            $(".hide-on-unobtrusive-loading").show();
        }
    }
}

exports.Toast = {
    show(data, callback) {
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

