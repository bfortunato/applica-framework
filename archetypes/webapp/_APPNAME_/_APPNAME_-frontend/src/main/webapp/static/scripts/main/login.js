define(["framework/core", "framework/model", "framework/plugins"], function(core, model, plugins) {
    return function() {
        $(document).ready(function() {
            /*$(".reset-password-form-container").modal({
                title: msg.MSG_RECOVER_PASSWORD,
                width: 400,
                destroyOnClose: false,
                buttons: [
                    { label: "OK", type: "primary", command: function() {

                    }}
                ]

            });
            */

            $(".recover-dialog-ok-button").click(function() {
                var mail = $(".reset-password-form-container input[name=mail]").val();
                if(core.utils.stringIsNullOrEmpty(mail)) {
                    return;
                }
                var service = new model.AjaxService();
                service.set("url", BASE + "account/resetPassword");
                service.set("data.mail", mail);
                service.set("method", "POST");
                service.on({
                    load: function() {
                        $.notify.info(msg.MSG_NEW_PASSWORD_SENT);
                        $(".reset-password-form-container").modal("close");
                    },
                    error: function(message) {
                        $.notify.error(message || msg.MSG_GENERIC_ERROR);
                        $(".reset-password-form-container").modal("close");
                    }
                });
                service.load();
            });

            $(".recover-password-button").click(function() {
                $(".reset-password-form-container").modal("open");
            });
        });


    }
});