var MainExtra = function() {
    var runToolbox = function() {

        if ($('#skin-toolbox').length) {

            // Toggles Theme Settings Tray
            $('#skin-toolbox .panel-heading, .toolbox-button').on('click', function() {
                $('#skin-toolbox').toggleClass('toolbox-open');
            });
            // Disable text selection
            $('#skin-toolbox .panel-heading, .toolbox-button').disableSelection();

            // Cache component elements
            var Breadcrumbs = $('#topbar');
            var Sidebar = $('#sidebar_left');
            var Header = $('.navbar');
            var Branding = Header.children('.navbar-branding');

            // Possible Component Skins
            var headerSkins = "bg-primary bg-success bg-info bg-warning bg-danger bg-alert bg-system bg-dark bg-light";
            var sidebarSkins = "sidebar-light light dark";

            // Theme Settings
            var settingsObj = {
                // 'headerTone': true,
                'headerSkin': 'bg-light',
                'sidebarSkin': 'sidebar-default',
                'headerState': 'navbar-fixed-top',
                'breadcrumbState': 'relative',
                'breadcrumbHidden': 'visible'
            };

            // Local Storage Theme Key
            var themeKey = 'admin-settings';

            // Local Storage Theme Get
            var themeGet = localStorage.getItem(themeKey);

            // Set new key if one doesn't exist
            if (themeGet === null) {
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
                themeGet = localStorage.getItem(themeKey);
            }

            // Restore Theme Settings from Local Storage Key
            (function() {

                var settingsParse = JSON.parse(themeGet);
                settingsObj = settingsParse;

                $.each(settingsParse, function(i, e) {
                    switch (i) {
                        case 'headerSkin':
                            Header.removeClass(headerSkins).addClass(e);
                            Branding.removeClass(headerSkins).addClass(e + ' dark');

                            // if (settingsObj['headerTone'] === true) {
                            // 	Branding.addClass('dark');
                            // }

                            if (e === "bg-light") {
                                Branding.removeClass(headerSkins);
                            }
                            else {
                                Branding.removeClass(headerSkins).addClass(e);
                            }

                            $('#toolbox-header-skin input[value="bg-light"]').prop('checked', false);
                            $('#toolbox-header-skin input[value="' + e + '"]').prop('checked', true);
                            break;
                        case 'sidebarSkin':
                            Sidebar.removeClass(sidebarSkins).addClass(e);
                            $('#toolbox-sidebar-skin input[value="bg-light"]').prop('checked', false);
                            $('#toolbox-sidebar-skin input[value="' + e + '"]').prop('checked', true);
                            break;
                        case 'headerState':
                            if (e === "navbar-fixed-top") {
                                Header.addClass('navbar-fixed-top');
                                $('#header-option').prop('checked', true);
                            } else {
                                Header.removeClass('navbar-fixed-top');
                                $('#header-option').prop('checked', false);
                            }
                            break;
                        case 'sidebarState':
                            if (e === "affix") {
                                Sidebar.addClass('affix');
                                // Recaculate nano scroller dimensions after affix change
                                $(".nano").nanoScroller({
                                    preventPageScrolling: true
                                });
                                $('#sidebar-option').prop('checked', true);
                            } else {
                                Sidebar.removeClass('affix');
                                $('#sidebar-option').prop('checked', false);
                            }
                            break;
                        case 'breadcrumbState':
                            if (e === "affix") {
                                Breadcrumbs.addClass('affix');
                                $('#breadcrumb-option').prop('checked', true);
                            } else {
                                Breadcrumbs.removeClass('affix');
                                $('#breadcrumb-option').prop('checked', false);
                            }
                            break;
                        case 'breadcrumbHidden':
                            if (e === "hidden") {
                                Breadcrumbs.addClass('hidden');
                                $('#breadcrumb-hidden').prop('checked', true);
                            } else {
                                Breadcrumbs.removeClass('hidden');
                                $('#breadcrumb-hidden').prop('checked', false);
                            }
                            break;
                    }
                });

            })();

            // Header Skin Switcher
            $('#toolbox-header-skin input').on('click', function() {
                var This = $(this);
                var Val = This.val();
                var ID = This.attr('id');

                // if (ID === "headerTwoTone" && This.prop("checked")) {
                //  settingsObj['headerTone'] = true;
                // 	localStorage.setItem(themeKey, JSON.stringify(settingsObj));
                // 	return;
                // }
                // else {
                //  settingsObj['headerTone'] = false;
                // 	localStorage.setItem(themeKey, JSON.stringify(settingsObj));

                // }

                // Swap Header Skin
                Header.removeClass(headerSkins).addClass(Val);
                Branding.removeClass(headerSkins).addClass(Val + ' dark');

                // Save new Skin to Settings Key
                settingsObj['headerSkin'] = Val;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Sidebar Skin Switcher
            $('#toolbox-sidebar-skin input').on('click', function() {
                var Val = $(this).val();

                // Swap Sidebar Skin
                Sidebar.removeClass(sidebarSkins).addClass(Val);

                // Save new Skin to Settings Key
                settingsObj['sidebarSkin'] = Val;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Fixed Header Switcher
            $('#header-option').on('click', function() {
                var headerState = "navbar-fixed-top";

                if (Header.hasClass('navbar-fixed-top')) {
                    Header.removeClass('navbar-fixed-top');
                    headerState = "relative";

                    // Remove Fixed Sidebar option if navbar isnt fixed
                    Sidebar.removeClass('affix');
                    $('#sidebar-option').parent('.checkbox-custom').addClass('checkbox-disabled').end().prop('checked', false).attr('disabled', true);
                    settingsObj['sidebarState'] = "";
                    localStorage.setItem(themeKey, JSON.stringify(settingsObj));

                    // Remove Fixed Breadcrumb option if navbar isnt fixed
                    Breadcrumbs.removeClass('affix');
                    $('#breadcrumb-option').parent('.checkbox-custom').addClass('checkbox-disabled').end().prop('checked', false).attr('disabled', true);
                    settingsObj['breadcrumbState'] = "";
                    localStorage.setItem(themeKey, JSON.stringify(settingsObj));

                } else {
                    Header.addClass('navbar-fixed-top');
                    headerState = "navbar-fixed-top";
                    // Enable fixed sidebar and breadcrumb options
                    $('#sidebar-option').parent('.checkbox-custom').removeClass('checkbox-disabled').end().attr('disabled', false);
                    $('#breadcrumb-option').parent('.checkbox-custom').removeClass('checkbox-disabled').end().attr('disabled', false);
                }

                // Save new setting to Settings Key
                settingsObj['headerState'] = headerState;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Fixed Sidebar Switcher
            $('#sidebar-option').on('click', function() {
                var sidebarState = "";

                if (Sidebar.hasClass('affix')) {
                    Sidebar.removeClass('affix');
                    // Remove left over inline styles from nanoscroller plugin
                    $(".nano").nanoScroller({ flash: true });
                    $(".nano-content").attr('style', '');
                    sidebarState = "";
                } else {
                    Sidebar.addClass('affix');
                    // Recaculate nano scroller dimensions after affix change
                    $(".nano.affix").nanoScroller({
                        preventPageScrolling: true
                    });
                    sidebarState = "affix";
                }

                $(window).trigger('resize');

                // Save new setting to Settings Key
                settingsObj['sidebarState'] = sidebarState;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Fixed Breadcrumb Switcher
            $('#breadcrumb-option').on('click', function() {

                var breadcrumbState = "";

                if (Breadcrumbs.hasClass('affix')) {
                    Breadcrumbs.removeClass('affix');
                    breadcrumbState = "";
                } else {
                    Breadcrumbs.addClass('affix');
                    breadcrumbState = "affix";
                }

                // Save new setting to Settings Key
                settingsObj['breadcrumbState'] = breadcrumbState;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Hidden Breadcrumb Switcher
            $('#breadcrumb-hidden').on('click', function() {
                var breadcrumbState = "";

                if (Breadcrumbs.hasClass('hidden')) {
                    Breadcrumbs.removeClass('hidden');
                    breadcrumbState = "";
                } else {
                    Breadcrumbs.addClass('hidden');
                    breadcrumbState = "hidden";
                }

                // Save new setting to Settings Key
                settingsObj['breadcrumbHidden'] = breadcrumbState;
                localStorage.setItem(themeKey, JSON.stringify(settingsObj));
            });

            // Clear local storage button and confirm dialog
            $("#clearLocalStorage").on('click', function() {
                (new PNotify({
                    title: 'Are you sure?',
                    hide: false,
                    type: 'dark',
                    addclass: "mt50",
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    confirm: {
                        confirm: true,
                        buttons: [{
                            text: "Yup, Do it.",
                            addClass: "btn-sm btn-info"
                        }, {
                            text: "Cancel",
                            addClass: "btn-sm btn-danger"
                        }]
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function() {
                        localStorage.clear();
                        location.reload();
                    }).on('pnotify.cancel', function() {
                        return;
                    });

            });
        }
    };

    var runFullscreen = function() {

        // Fullscreen Functionality
        var screenCheck = $.fullscreen.isNativelySupported();

        // Attach handler to navbar fullscreen button
        $('.request-fullscreen').click(function() {

            // Check for fullscreen browser support
            if (screenCheck) {
                if ($.fullscreen.isFullScreen()) {
                    $.fullscreen.exit();
                } else {
                    $('html').fullscreen({
                        overflow: 'visible'
                    });
                }
            } else {
                alert('Your browser does not support fullscreen mode.')
            }
        });

    };

    return {
        init: function() {
            runToolbox();
            runFullscreen();
        }
    };
}();