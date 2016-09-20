/**
 * Applica (www.applica.guru).
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 1:42 PM
 */

define(["framework/core"], function(core) {

    //numeric
    (function ($) {

        window._E = function (el) {
            return $(document.createElement(el));
        };

        jQuery.fn.appendIf = function(condition, el) {
            if(condition) {
                jQuery.fn.append.call(this, el);
            }

            return this;
        };

        var methods = {
            init: function (opts) {
                var options = {
                    min: -1,
                    max: -1,
                    allowDecimals: false
                };

                $.extend(options, opts);

                $(this).data("options", options);
                $(this)
                    .keydown(
                    function (event) {
                        // Allow: backspace, delete, tab, escape, and
                        // enter
                        if (event.keyCode == 46
                            || event.keyCode == 8
                            || event.keyCode == 9
                            || event.keyCode == 27
                            || event.keyCode == 13
                            ||
                                // Allow: Ctrl+A
                            (event.keyCode == 65 && event.ctrlKey === true)
                            ||
                                // Allow: home, end, left, right
                            (event.keyCode >= 35 && event.keyCode <= 39)) {
                            // let it happen, don't do anything
                            return;
                        } else if(event.keyCode == 190) { //allow decimal separator as point
                            if (!opts.allowDecimals) {
                                event.preventDefault()
                            } else {
                                var c = $(this).val();
                                //if separator already exists, ignore
                                if (c.indexOf(".") != -1) {
                                    event.preventDefault();
                                }
                            }
                        } else if(event.keyCode == 188) { //allow decimal separator as comma, but replaced from a point
                            if (!opts.allowDecimals) {
                                event.preventDefault()
                            } else {
                                var c = $(this).val();
                                //if separator already exists, ignore
                                if (c.indexOf(".") != -1) {
                                    event.preventDefault();
                                } else {
                                    c = c + ".";
                                    $(this).val(c);
                                    event.preventDefault();
                                }
                            }
                        } else {
                            // Ensure that it is a number and stop the
                            // keypress
                            if (event.shiftKey
                                || (event.keyCode < 48 || event.keyCode > 57)
                                && (event.keyCode < 96 || event.keyCode > 105)) {
                                event.preventDefault();
                            }
                        }
                    });

                $(this).change(function () {
                    var options = $(this).data("options");
                    var value = parseFloat($(this).val());
                    if (options.min != -1 && value < options.min) {
                        $(this).val(options.min);
                    }
                    if (options.max != -1 && value > options.max) {
                        $(this).val(options.max);
                    }
                });

            }
        };

        $.fn.numeric = function (opts) {
            if (methods[opts]) {
                methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                methods.init.apply(this, arguments);
            }
        };
    })(jQuery);

    /* loader */
    (function ($) {
        var ANIM_TIME = 500;
        var PADDING = 10;
        var element = null;

        function animate(size, position, aElement) {
            var right = position.left + size.width - PADDING - $(aElement).width();
            var left = position.left + PADDING;
            $(aElement).animate({
                left: right + "px"
            }, ANIM_TIME, function () {
                $(aElement).animate({
                    left: left + "px"
                }, ANIM_TIME, function () {
                    animate(size, position, aElement);
                });
            });
        }

        $.loader = {
            show: function (opts) {
                var options = $.extend({
                    parent: window,
                    opacity: 0.2,
                    zIndex: false
                }, opts);

                if ($(options.parent).data("loader-visible"))
                    return;

                element = $(options.parent).data("loader-element");
                $(options.parent).data("loader-visible", true);

                if (!element) {
                    (element = _E("div")).addClass("loader").appendTo("body")
                        .hide();

                    if (options.zIndex) {
                        $(element).css("z-index", options.zIndex);
                    }

                    $(options.parent).data("loader-element", element);
                }

                $(element).show();

                var size, position;
                if (window == options.parent) {
                    size = {
                        width: $(window).width(),
                        height: $(window).height()
                    };
                    position = {
                        top: 0,
                        left: 0
                    };
                } else {
                    size = core.utils.getFullElementSize(options.parent);
                    position = $(options.parent).offset();
                }

                var left = position.left + (size.width / 2 - $(element).width() / 2);
                var top = position.top + (size.height / 2 - $(element).height() / 2);

                $.overlay.show(options);
                $(element).stop().css({
                    top: top + "px",
                    left: left + "px"
                });

                //animate(size, position, element);
            },

            hide: function (opts) {
                var options = $.extend({
                    parent: window,
                    opacity: 0.2
                }, opts);

                element = $(options.parent).data("loader-element");
                if (!element)
                    return;
                if (!$(options.parent).data("loader-visible"))
                    return;
                $(options.parent).data("loader-visible", false);

                if (element) {
                    $.overlay.hide(options);
                    $(element).stop().hide();
                }
            }
        };
    })(jQuery);


    /*context menu*/
    (function ($) {
        $.fn.contextMenu = function (opts) {
            $(this).each(
                function () {
                    var menuOpen = false;
                    var self = this;
                    var firstTimeOpened = true;

                    if (!opts)
                        throw "Options not defined";
                    if (!opts.items)
                        throw "No items";

                    opts = $.extend({
                        position: "bottom-left",
                        open: function () {
                        },
                        close: function () {
                        }
                    }, opts);

                    var menu = _E("div").addClass("contextMenu").hide();
                    var show = function () {
                        $(".contextMenu").hide();

                        menu.slideDown(150);
                        menuOpen = true;
                        if (firstTimeOpened) {
                            // position relative to parent
                            var position = $(self).position();
                            var size = core.utils.getFullElementSize($(self));

                            var top = 0, left = 0;
                            if (opts.position.indexOf("left") != -1) {
                                left = position.left;
                            } else if (opts.position.indexOf("right") != -1) {
                                left = position.left + size.width;
                            }
                            if (opts.position.indexOf("top") != -1) {
                                top = position.top;
                            } else if (opts.position.indexOf("bottom") != -1) {
                                top = position.top + size.height;
                            }

                            $(menu).css({
                                top: top + "px",
                                left: left + "px"
                            });

                            if (menu.position().left + menu.width() > $("body")
                                    .width()) {
                                menu.css("right", "5px");
                            }
                        }
                        firstTimeOpened = false;

                        if (opts.show)
                            opts.show.call(this);
                    };
                    var hide = function () {
                        menu.fadeOut(150);
                        menuOpen = false;

                        if (opts.hide)
                            opts.hide.call(this);
                    };

                    for (i in opts.items) {
                        (function (item) {
                            var method = opts.items[item];
                            menu.append(_E("a").attr("href", "javascript:;")
                                    .html(item).click(function () {
                                        method.apply(self);
                                        hide();
                                        return false;
                                    })

                            );
                        })(i);
                    }

                    $(this).click(function () {
                        if (menuOpen)
                            hide();
                        else
                            show();
                        return false;
                    });
                    $(document).click(function () {
                        if (menuOpen) {
                            hide();
                        }
                    });

                    var ppos = $(this).parent().css("position");
                    if (ppos != "absolute" && ppos != "relative"
                        && ppos != "fixed") {
                        $(this).parent().css("position", "relative");
                    }
                    $(this).parent().append(menu);
                });
            return this;
        };
    }(jQuery));

    /* selectList */
    (function ($) {
        $.fn.selectList = function (opts) {
            var main = null;
            var selectionContainer = null;
            var options = null;

            function fixValue(value) {
                return value.replace("'", "\\\'");
            }

            function createSelection(label, value, group) {
                var selection = $("<a />")
                    .addClass("selection")
                    .attr("href", "javascript:;")
                    .attr("data-value", value)
                    .attr("data-selected", false)
                    .attr('data-group', group)
                    .attr("id", "sel_" + value)
                    .html(label)
                    .click(function () {
                        if (options.multiselect) {
                            var isSelected = $(this).attr("data-selected") == "true";
                            if (isSelected) {
                                $(this).attr("data-selected", false)
                                    .removeClass("selected")
                                    .find(".selected-icon").hide();
                            } else {
                                $(this).attr("data-selected", true)
                                    .addClass("selected")
                                    .find(".selected-icon").show();
                            }
                        } else {
                            $(selectionContainer).find(
                                ".selection[data-selected=true]")
                                .attr("data-selected", false)
                                .removeClass("selected")
                                .find(".selected-icon").hide();
                            $(this).attr("data-selected", true)
                                .addClass("selected")
                                .find(".selected-icon").show();

                        }
                    })
                    .prepend(_E("i").addClass("glyphicon glyphicon-icon-check selected-icon").css("margin-right", "3px").hide());

                return selection;
            }

            function createGroup(label) {
                var group = $('<a />')
                    .addClass('group')
                    .attr('href', 'javascript:;')
                    .html(label)
                    .click(function () {
                        var group = $(this).text();
                        $(selectionContainer).find('.selection[data-group="' + group + '"]').click();
                    });

                return group;
            }

            function selectAll() {
                $(selectionContainer).find('.selection').click();
            }

            function synchSelection() {
                $(selectionContainer).empty();
                $(main).find("input[type=hidden][name=" + options.name + "]").each(
                    function (i, input) {
                        $(selectionContainer).append(
                            createSelection($(input).attr("data-label"), $(
                                input).val(), $(input).attr(
                                'data-group')));
                    });
            }

            function synchHiddens() {
                if ($(main).find('.group').length == 0)
                    $(main).find("input[type=hidden][name=" + options.name + "]")
                        .remove();
                $(selectionContainer).find(".selection").each(
                    function (i, selection) {
                        $(main).append(
                            _E("input").attr("type", "hidden").attr(
                                "data-label", $(selection).text()).val(
                                $(selection).attr("data-value")).attr(
                                "name", options.name));
                    });
            }

            function storeReferences(element) {
                $(element).data("selectList_options", options);
            }

            function restoreReferences(element) {
                main = element;
                options = $(element).data("selectList_options");
                selectionContainer = $(main).find(".selectionContainer");
            }

            var methods = {
                init: function (opts) {
                    main = this;
                    options = {
                        allowDuplicates: false,
                        multiselect: true
                    };
                    $.extend(options, opts);

                    if (!opts.name)
                        throw "Name not specified";

                    selectionContainer = _E("div")
                        .addClass("selectionContainer")
                        .addClass("gui-input");

                    $(this).addClass("selectList").append(selectionContainer);

                    synchSelection();

                    storeReferences(main);
                },

                add: function (item) {
                    restoreReferences(this);
                    if (!options.allowDuplicates)
                        if ($(selectionContainer).find(".selection[data-value='" + fixValue(item.value) + "']").size() > 0)
                            return;

                    $(selectionContainer).append(createSelection(item.label, item.value));

                    synchHiddens();

                    $(this).trigger("change");
                },

                addAll: function (items) {
                    restoreReferences(this);
                    var group = null;
                    $(items).each(
                        function (i, item) {
                            if (!options.allowDuplicates && item.group == null)
                                if ($(selectionContainer).find(".selection[data-value='" + fixValue(item.value) + "']").size() > 0)
                                    return;

                            if (group == null || group != item.group) {
                                group = item.group;
                                if (!core.utils.stringIsNullOrEmpty(group)) {
                                    $(selectionContainer).append(createGroup(group));
                                }
                            }
                            $(selectionContainer).append(createSelection(item.label, item.value, item.group));
                        });

                    synchHiddens();

                    $(this).trigger("change");
                },

                removeItem: function (value) {
                    restoreReferences(this);
                    $(selectionContainer).find(".selection[data-value='" + fixValue(value) + "']").remove();

                    synchHiddens();

                    $(this).trigger("change");
                },

                removeSelection: function (value) {
                    restoreReferences(this);
                    $(selectionContainer).find(".selection[data-selected=true]").remove();

                    synchHiddens();

                    $(this).trigger("change");
                },

                clear: function () {
                    restoreReferences(this);
                    $(selectionContainer).find(".selection").remove();
                    synchHiddens();

                    $(this).trigger("change");
                },

                getSelectedData: function () {
                    restoreReferences(this);
                    var data = [];
                    $(selectionContainer).find(".selection[data-selected=true]")
                        .each(function (i, res) {
                            data.push({
                                label: $(res).text(),
                                value: $(res).attr("data-value")
                            });
                        });

                    return data;
                },

                getData: function () {
                    restoreReferences(this);
                    var data = [];
                    $(selectionContainer).find(".selection").each(function (i, res) {
                        data.push({
                            label: $(res).text(),
                            value: $(res).attr("data-value")
                        });
                    });

                    return data;
                },

                selectAll: function () {
                    restoreReferences(this);
                    selectAll();
                }
            };

            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(
                    arguments, 1));
            } else {
                methods.init.apply(this, arguments);
            }
        };
    })(jQuery);

    /* masterDetail */
    (function ($) {
        $.masterDetail = {
            defaultBinder: {
                toForm: function (form, item) {
                    if (item) {
                        for (var key in item) {
                            $(form).find("input[data-bind='" + key + "']").val(
                                item[key]);
                        }
                    } else {
                        $(form).find("input[data-bind]").val("");
                    }
                },

                toItem: function (form, item) {
                    $(form).find("input[data-bind]").each(function () {
                        var bind = $(this).attr("data-bind");
                        item[bind] = $(this).val();
                    });
                },

                validate: function (form, item, errors) {
                }
            }
        };

        $.fn.masterDetail = function (opts) {
            var main = null;
            var options = null;
            var editingItem = null;
            var isNewItem = false;

            var binder = $.masterDetail.defaultBinder;

            function storeReferences(element) {
                $(element).data("masterDetail_options", options);
            };

            function restoreReferences(element) {
                main = element;
                options = $(element).data("masterDetail_options");
            };

            function createDialog() {
                $(options.form)
                    .dialog(
                    {
                        appendTo: main,
                        zIndex: 10000,
                        autoOpen: false,
                        modal: true,
                        width: $(options.form).attr("data-width") || 640,
                        height: $(options.form).attr("data-height") || 480,
                        title: options.formTitle,
                        resizable: false,
                        buttons: {
                            OK: function () {
                                options.binder.toItem(options.form,
                                    editingItem);
                                if (options.binder.validate) {
                                    var errors = [];
                                    options.binder.validate(
                                        options.form, editingItem,
                                        errors);
                                    if (errors.length != 0) {
                                        var errorString = "";
                                        for (var i = 0; i < errors.length; i++) {
                                            errorString += errors[i]
                                            + "\r\n";
                                        }
                                        alert(errorString);
                                        return;
                                    }
                                }
                                if (isNewItem) {
                                    addItemToList(editingItem);
                                } else {
                                    replaceSelectedListItem(editingItem);
                                }
                                $(this).dialog("close");
                            },
                            Annulla: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
            }
            ;

            function addItemToList(item) {
                var json = JSON.stringify(item);
                $(main).selectList("add", {
                    label: options.labelFormatter(item),
                    value: json
                });
            };

            function replaceSelectedListItem(item) {
                $(main).selectList("removeSelection");
                addItemToList(item);
            };

            function createButtons() {
                var buttonsContainer = _E("div").addClass("buttonsContainer");

                // add buttons
                $(buttonsContainer)
                    .append(
                    _E("input")
                        .attr("type", "button")
                        .attr("value","Aggiungi").click(function () {
                            isNewItem = true;
                            editingItem = {};
                            options.binder.toForm(options.form, null);
                            $(options.form).dialog("open");
                        }))
                    .append(
                    _E("input")
                        .attr("type", "button")
                        .attr("value", "Modifica")
                        .click(
                        function () {
                            isNewItem = false;
                            var items = $(main).selectList(
                                "getSelectedData");
                            if (items.length > 0) {
                                editingItem = $
                                    .parseJSON(items[0].value);
                                options.binder.toForm(
                                    options.form,
                                    editingItem);
                                $(options.form).dialog("open");
                            } else {
                                alert("Nessun elemento selezionato");
                            }
                        })).append(
                    _E("input").attr("type", "button").attr("value",
                        "Rimuovi").click(function () {
                            $(main).selectList("removeSelection");
                        }));

                $(main).append(buttonsContainer);
            };

            var methods = {
                init: function (opts) {
                    main = this;
                    options = {
                        labelFormatter: function (item) {
                            return item.label;
                        },
                        form: null,
                        name: null,
                        formTitle: "Create/Edit",
                        binder: binder
                    };
                    $.extend(options, opts);

                    if (!options.name)
                        throw "Name not specified";
                    if (!options.form)
                        throw "Form not specified";

                    $(this).addClass("masterDetail");
                    $(this).selectList({
                        name: options.name,
                        allowDuplicates: true,
                        multiselect: false
                    });

                    createDialog();
                    createButtons();

                    $(main).append($("<div style='clear: both;'></div>"));

                    storeReferences(main);
                }
            };

            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(
                    arguments, 1));
            } else {
                methods.init.apply(this, arguments);
            }
        };
    })(jQuery);

    /* searchableInput */
    (function ($) {
        $.fn.searchableInput = function (opts) {
            var main = null;
            var buttonsContainer = null;
            var keywordTextbox = null;
            var resultsDiv = null;
            var dialog = null;
            var options = null;
            //il parametro "forza" una chiamata al server anche dopo aver già materializzato i dati la prima volta
            var forceReload = false;
            //Il parametro consente di ottenere l'url del servizio in modo dinamico richiamando una funzione
            var getUrlFunction = null;
            var resultsIsSelectList = false;
            var singleValue = null;
            var mainText = null;

            function fixValue(value) {
                return value.replace("'", "\\\'");
            }

            function createDialog() {
                keywordTextbox = _E("input")
                    .attr("type", "text")
                    .addClass("keyword")
                    .addClass("form-control")
                    .attr("autofocus", "true")
                    .keyup(function (event) {
                        if (event.which == 13) {
                            doSearch();
                            event.preventDefault();

                        }
                    });

                resultsDiv = _E("div");
                resultsDiv.html(msg.MSG_SEARCHABLEINPUT_HELP);

                dialog = _E("div")
                    .addClass("searchableInputDialog")
                    .append(keywordTextbox)
                    .append(resultsDiv);

                var buttons = {
                    OK: {
                        primary: true,
                        command: function () {
                            var items = $(resultsDiv).selectList("getSelectedData");
                            if (options.mode == "multi") {
                                $(main).selectList("addAll", items);
                            } else if (options.mode == "single") {
                                setSingleValue(items[0]);
                                //Esegue, se settata, la funzione designata ad essere eseguita dopo la selezione del valore
                                if(opts.onSelectFunction) {
                                    opts.onSelectFunction();
                                }
                            }
                            $(this).modalDialog("close");
                        }
                    }
                };

                if (options.mode == 'multi') {
                    buttons[msg.TOOLBAR_SELECT_ALL] = {
                        action: true,
                        command: function () {
                            $(resultsDiv).selectList("selectAll");
                        }
                    };
                }
                $(dialog).modalDialog({
                    //se specificate, setta dimensioni custom alla webpart di selezione
                    height: opts.height || 400,
                    width: opts.width || 400,
                    autoOpen: false,
                    title: options.title || "Selezionare",
                    buttons: buttons,
                    close: function () {
                        $(main).focus();
                    }
                });

                $(main).data("searchableInput_dialog", dialog);
            }

            function doSearch() {
                if (!resultsIsSelectList) {
                    $(resultsDiv).empty().selectList({
                        name: "results_" + options.name,
                        allowDuplicates: false,
                        multiselect: options.mode == "multi"
                    });
                    resultsIsSelectList = true;
                }

                var url = options.serviceUrl || options.getUrlFunction();
                var keyword = $(keywordTextbox).val();

                $.post(url, {
                    keyword: keyword
                }, function (response) {
                    $(resultsDiv).selectList("clear");
                    if (response && !response.error) {
                        $(resultsDiv).selectList("addAll", response.value);
                    } else {
                        alert("Errore durante il recupero dei dati: " + response.error);
                    }
                }, "json");
            }

            function initMulti() {
                $(main).selectList(options);

                buttonsContainer = _E("div")
                    .addClass("buttonsContainer")
                    .addClass("input-footer")
                    .addClass("text-right")
                ;

                // add buttons
                $(buttonsContainer)
                    .append(
                    _E("a")
                        .attr("href", "javascript:;")
                        .addClass("text-success mr15")
                        .append("<i class='fa fa-plus-circle pr5'></i>")
                        .append(msg.LABEL_ADD ? msg.LABEL_ADD : "Add")
                        .click(function () {
                            $(dialog).modalDialog("open");
                            if (!main.autoloaded
                                && options.autoloadResults) {
                                main.autoloaded = true;
                                doSearch();
                            }
                        })
                )
                    .append(
                    _E("a")
                        .attr("href", "javascript:;")
                        .addClass("text-danger")
                        .append("<i class='fa fa-minus-circle pr5'></i>")
                        .append(msg.LABEL_REMOVE ? msg.LABEL_REMOVE : "Remove")
                        .click(function () {
                            $(main).selectList("removeSelection");
                        })

                )
                    .append(
                    _E("span")
                        .addClass("pull-left")
                        .text("Push 'Add' button to open search dialog")
                )
                ;

                if (opts.allowCustom) {
                    $(buttonsContainer)
                        .append(
                        _E("input")
                            .attr("type", "button")
                            .addClass("btn btn-small btn-block")
                            .attr("value", "Altro")
                            .css("margin-top", "10px")
                            .click(
                            function () {
                                var customItem = prompt("Specificare altro");
                                if (customItem) {
                                    $(main)
                                        .selectList(
                                        "add",
                                        {
                                            label: customItem,
                                            value: customItem
                                        });
                                }
                            }));
                }

                // clear floating divs
                $(main)
                    .addClass("searchableInput")
                    .addClass("searchableInputMulti")
                    .append(buttonsContainer)
                    .append(_E("div")
                        .css("clear", "both")
                );
            }

            function initSingle() {
                singleValue = $(main).find("input[type=hidden][name=" + options.name + "]");
                if ($(singleValue).size() == 0) {
                    singleValue = _E("input").attr("name", options.name).attr("type", "hidden").appendTo(main);
                }

                mainText = _E("span").addClass("mainText").appendTo(main);
                var self = this;
                $(main)
                    .addClass("searchableInput")
                    .addClass("searchableInputSingle")
                    .addClass("gui-input")
                    .attr("tabindex", 0)
                    .keyup(function (e) {
                        if (e.which == 13) {
                            $(dialog).modalDialog("open");
                            e.preventDefault();
                        }
                    })
                    .append(_E('button')
                        .addClass("btn btn-xs btn-warning pull-right")
                        .click(function (e) {
                            e.preventDefault();
                            setSingleValue({
                                value: '',
                                label: 'NA'
                            });
                            //Esegue, se settata, la funzione designata ad essere eseguita dopo la rimozione del valore
                            if(opts.onRemoveFunction) {
                                opts.onRemoveFunction();
                            }
                            return false;
                        })
                        .append(_E("i")
                            .addClass("glyphicon glyphicon-remove")
                            .text("")
                    )
                )
                    .click(function () {
                        if ((!main.autoloaded || options.forceReload) && options.autoloadResults) {
                            main.autoloaded = true;
                            doSearch();
                        }
                        $(dialog).modalDialog("open");
                    });

                syncSingleLabel();
            }

            function setSingleValue(value) {
                $(singleValue).val(value.value);
                $(mainText).text(value.label);
                $(singleValue).trigger("change");
            }


            function syncSingleLabel() {
                var label = $(singleValue).attr("data-label");
                $(mainText).text(label);
            }

            var methods = {
                init: function (opts) {
                    if (!opts.serviceUrl && !opts.getUrlFunction)
                        throw "Service url not specified";
                    if (!opts.name)
                        throw "Name not specified";

                    main = this;
                    options = $.extend({
                        mode: "multi",
                        allowDuplicates: false,
                        allowCustom: false,
                        autoloadResults: true
                    }, opts);

                    createDialog();

                    if (options.mode == "multi") {
                        initMulti();
                    } else if (options.mode == "single") {
                        initSingle();
                    }
                },

                destroy: function() {
                    var dialog = $(this).data("searchableInput_dialog");
                    if(dialog) {
                        $(dialog).modalDialog("destroy");
                    }
                }
            };

            if (methods[opts]) {
                methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                methods.init.apply(this, arguments);
            }
        };
    }(jQuery));

    /* notifications */
    (function ($) {
        function doNoty(message, type, buttons) {
            new PNotify({
                title: undefined,
                text: message,
                type: type,
                stack: {
                    "dir1": "down",
                    "dir2": "left",
                    "push": "top",
                    "spacing1": 10,
                    "spacing2": 10
                },
                delay: 3000
            });
        }

        $.notify = function (message, buttons) {
            doNoty(message, "notification", buttons);
        };

        $.notify.error = function (message, buttons) {
            doNoty(message, "error", buttons);
        };

        $.notify.warn = function (message, buttons) {
            doNoty(message, "warning", buttons);
        };

        $.notify.alert = function (message, buttons) {
            doNoty(message, "alert", buttons);
        };

        $.notify.success = function (message, buttons) {
            doNoty(message, "success", buttons);
        };

        $.notify.info = function (message, buttons) {
            doNoty(message, "information", buttons);
        };

        $.notify.timeout = 3000;
    })(jQuery);

// custom overlay
    (function ($) {
        var counter = 0;
        var element = null;

        function measure(options) {
            element = $(options.parent).data("modal-overlay-element");
            var bounds = null;
            if (window == options.parent || $(options.parent).get(0).tagName.toLowerCase() == "body") {
                var windowBounds = core.utils.bounds($(window));
                var bodyBounds = core.utils.bounds($("body"));
                if(bodyBounds.height > windowBounds.height) {
                    bounds = bodyBounds;
                } else {
                    bounds = windowBounds;
                }
            } else {
                bounds = core.utils.bounds(options.parent);
            }
            $(element).css({
                top: bounds.top + "px",
                left: bounds.left + "px",
                height: bounds.height + "px",
                width: bounds.width + "px"
            });
        }

        var Overlay = {
            isActive: false,

            createIfNotExists: function (options) {
                element = $(options.parent).data("modal-overlay-element");

                if (!element) {
                    (element = _E("div")).addClass("metro-modal").appendTo($("body"));

                    if (options.zIndex) {
                        $(element).css("z-index", options.zIndex);
                    }

                    $(options.parent).data("modal-overlay-element", element);
                    $(options.parent).data("modal-overlay-counter", 1);

                    /*
                     * $(window).resize(function() { measure(options); });
                     */
                }

            },

            show: function (options) {
                var defaultParent = $(window).height() > $("body").height() ? window : $("body");

                options = $.extend({
                    animate: true,
                    opacity: 0.75,
                    click: null,
                    closeOnClick: false,
                    parent: defaultParent,
                    zIndex: false
                }, options);

                counter = $(options.parent).data("modal-overlay-counter");
                if (!counter)
                    counter = 0;

                counter++;
                $(options.parent).data("modal-overlay-counter", counter);
                if (counter == 1) {
                    Overlay.createIfNotExists(options);

                    $(element).unbind("click").bind("click", function () {
                        if (options.closeOnClick) {
                            $.overlay.hide(options);
                        }
                        if (options.click) {
                            $.proxy(options.click, this)(arguments);
                        }
                    });

                    if (options.animate) {
                        $(element).stop().fadeTo(250, options.opacity);
                    } else {
                        $(element).css("opacity", options.opacity).show();
                    }

                    Overlay.isActive = true;
                    //measure(options);
                }
            },

            hide: function (options) {
                var defaultParent = $(window).height() > $("body").height() ? window : $("body");

                options = $.extend({
                    animate: true,
                    parent: defaultParent
                }, options);

                element = $(options.parent).data("modal-overlay-element");
                counter = $(options.parent).data("modal-overlay-counter");
                if (!counter)
                    counter = 0;
                counter--;
                $(options.parent).data("modal-overlay-counter", counter);
                if (counter < 0) {
                    $(options.parent).data("modal-overlay-counter", 0);
                    throw "$.overlay.hide() is called many times";
                }

                if (counter == 0) {
                    Overlay.isActive = false;

                    if (options.animate) {
                        $(element).stop().fadeOut(250);
                    } else {
                        $(element).hide();
                    }
                }
            }
        };

        $.overlay = Overlay;
    })(jQuery);

    /* remoteModalDialog */
    (function ($) {
        $.remoteModalDialog = function (opts) {

            function checkContainer() {
                if ($("#remoteModalDialogContainer").size() == 0) {
                    $("body").append(
                        _E("div").addClass("remoteModalDialogContainer").attr(
                            "id", "remoteModalDialogContainer").hide());
                }
            }

            self = this;

            var options = $.extend({
                url: null,
                method: "GET",
                data: {},
                complete: function (content) {
                },
                error: function () {
                }
            }, opts);

            if (!options.url)
                throw "remoteModalDialog.init(): Please specify an url";
            checkContainer();

            $.loader.show();
            $.ajax({
                type: options.method,
                data: options.data,
                url: opts.url,
                success: function (response) {
                    $.loader.hide();

                    var content = _E("div").html(response);
                    $("#remoteModalDialogContainer").empty().append(content);

                    $(content).modalDialog(options);

                    if (options.complete)
                        options.complete(content);
                },
                error: function () {
                    $.loader.hide();

                    if (options.error)
                        options.error();
                }
            });
        };
    })(jQuery);

    /* custom modal dialog */
    (function ($) {
        var MAX_HEIGHT_PERCENTUAL = 80;
        var MAX_WIDTH_PERCENTUAL = 80;

        var utils = core.utils;

        var STACK = [];
        var CURRENT = null;

        $.modalDialog = {
            closeAll: function() {
                if(STACK.length > 0) {
                    var previous = STACK[STACK.length - 1];
                    $(previous).on("close", function() {
                        $.modalDialog.closeAll();
                    });

                    $(previous).modalDialog("close");
                }
            }
        };

        $.fn.modalDialog = function (opts) {
            //var resizeHandler = null;
            var self = null;
            var options = null;
            var data = {};

            function storeReferences(element) {
                $(element).data("modalDialog_options", options);
                $(element).data("modalDialog_data", data);
            }

            function restoreReferences(element) {
                self = element;
                options = $(element).data("modalDialog_options");
                data = $(element).data("modalDialog_data");
            }

            function measure(animate) {
                var computedContentSize = core.utils.bounds(data.dialogBody);
                var contentHeight = computedContentSize.height;
                var contentWidth = computedContentSize.width;
                var contentHeightBorders = contentHeight - $(data.dialogBody).height();

                var wrapperHeight = core.utils.bounds(data.dialogContent).height;
                //var heightDelta = wrapperHeight - contentHeight;
                var maxHeight = 0;

                var containerHeight = 0;
                if (options.height) {
                    containerHeight = parseInt(options.height);
                    maxHeight = containerHeight ;
                } else {
                    maxHeight = Math.min(($(window).height() ) / 100 * MAX_HEIGHT_PERCENTUAL, contentHeight);
                    containerHeight = maxHeight ;
                }
                maxHeight += 5;

                var maxWidth = 0;

                var containerWidth= 0;
                if (options.width) {
                    containerWidth = parseInt(options.width);
                    maxWidth = containerWidth;
                } else {
                    maxWidth = Math.min(($(window).width() ) / 100 * MAX_WIDTH_PERCENTUAL, contentWidth);
                    containerWidth = maxWidth;
                }

                $(data.dialogBody)
                    .height((maxHeight - contentHeightBorders) + "px")
                    .width(containerWidth + "px");

                var containerSize = core.utils.bounds(data.dialog);
                var top = ($(window).height() / 2 - containerSize.height / 2);
                var left = ($(window).width() / 2 - containerSize.width / 2);

                $(data.dialog)
                    .css("top", top + "px")
                    .css("left", left + "px");

            }

            function invokeCloseEvents() {
                if($.isFunction(options.close)) {
                    options.close.call(self, data.dialogResult || "cancel");
                }

                $(self).trigger("close");

                if($.isFunction(options.hide)) {
                    options.hide.call(self, data.dialogResult || "cancel");
                }

                $(self).trigger("hide");
            }

            var methods = {
                init: function (opts) {
                    self = this;
                    var width = null;
                    var height = null;

                    if (opts.fitToScreen) {
                        var top = 10, left = 10;
                        width = $(document).width() - left * 2;
                        height = $(document).height() - top * 2;
                    }

                    options = $.extend({
                        autoOpen: false,
                        width: width,
                        height: height,
                        close: null,
                        destroyOnClose: false,
                        title: "Modal dialog",
                        buttons: {},
                        cancelButton: msg.LABEL_CLOSE,
                        cancel: null
                    }, opts);

                    var template = $(
                        '<div class="framework-modal admin-form">' +
                        '<div class="panel panel-primary heading-border" style="width: auto;">' +
                        '<div class="panel-heading">' +
                            //'<button type="button" class="close">&times;</button>' +
                        '<span class="panel-title">' + options.title + '</span>' +
                        '</div>' +
                        '<div class="panel-body">' +
                        '</div>' +
                        '<div class="panel-footer text-right">' +
                        '</div>' +
                        '</div>' +
                        '</div>');

                    var close = $(template).find("button.close");
                    var dialogBody = $(template).find(".panel-body");
                    var footer = $(template).find(".panel-footer");

                    if (options.cancelButton) {
                        _E("button")
                            .text(options.cancelButton)
                            .addClass("btn btn-default")
                            .click(function () {
                                $(self).modalDialog("close");
                            }).appendTo(footer);
                    }

                    $(close).click(function() {
                        self.modalDialog("close");
                    });

                    for (k in options.buttons) {
                        (function(key) {
                            var label = key;
                            var command, action, primary, type;
                            if($.isFunction(options.buttons[key])) {
                                command = options.buttons[key];
                                action = false;
                                primary = false;
                            } else {
                                command = options.buttons[key].command;
                                action = options.buttons[key].action;
                                primary = options.buttons[key].primary;
                                label = options.buttons[key].label || label;
                                type = options.buttons[key].type;
                            }

                            var buttonElement = _E("button")
                                .addClass("btn ml5")
                                .text(label)
                                .click(function () {
                                    command.call(self);
                                    data.dialogResult = key;
                                })
                                .appendTo(footer);

                            if(primary) {
                                buttonElement.addClass("btn-primary");
                            }

                            if(action) {
                                buttonElement.addClass("btn-link pull-left");
                            }

                            if(type) {
                                buttonElement.addClass("btn-" + type);
                            }
                        })(k);

                    }

                    dialogBody.append(self);

                    $("body").append(template);

                    storeReferences(self);

                    data.dialog = template;
                    data.dialogBody = dialogBody;
                    data.dialogContent = template.find(".modal-content");
                    data.dialogHeader = template.find(".modal-header");
                    data.dialogFooter = footer;

                    if(options.autoOpen){
                        $(self).modalDialog("open");
                    }
                },

                setTitle: function (title) {
                    restoreReferences(this);
                    if (!data)
                        return;
                    $(data.template).find(".modal-title").text(title);
                },

                is: function () {
                    restoreReferences(this);
                    return data != null && data != undefined;
                },

                updateSize : function() {
                    restoreReferences(this);
                    if (!data)
                        return;

                    measure();
                },

                open: function() {
                    restoreReferences(this);
                    if (!data)
                        return;

                    $(data.dialog).show();

                    data.isActive = true;

                    measure();

                    STACK.push(self);

                    if(STACK.length > 1) {
                        var previous = STACK[STACK.length - 2];
                        var previousDialog = $(previous).data("modalDialog_data").dialog;
                        previousDialog
                            .animate({
                                top: $(window).height()
                            }, 250);
                    } else {
                        $.overlay.show({
                            closeOnClick : false,
                            click : function() {
                                var current = STACK[STACK.length - 1];
                                current.dialogResult = "cancel";
                                $(current).modalDialog("close");
                            }
                        });
                    }

                    var top = parseInt($(data.dialog).css("top"));

                    var opacity = 1;

                    if(STACK.length == 1) {
                        opacity = 0;
                    }

                    $(data.dialog)
                        .css("opacity", opacity)
                        .css("top", -$(data.dialog).height() + "px").stop()
                        .animate({
                            top : top + "px",
                            opacity: 1
                        }, 250, function(){
                            if (options.shown)
                                options.shown.call();
                        });

                },

                close : function() {
                    restoreReferences(this);
                    var self = this;
                    if (!data)
                        return;

                    STACK.pop();

                    if(STACK.length > 0) {
                        var previous = STACK[STACK.length - 1];
                        var previousDialog = $(previous).data("modalDialog_data").dialog;
                        var top = $(window).height() / 2 - $(previousDialog).height() / 2;

                        previousDialog.animate({
                            top: top + "px"
                        }, 250);
                    }

                    var opacity = 1;
                    if(STACK.length == 0) {
                        opacity = 0;
                    }

                    $(data.dialog).stop().animate({
                        top : -$(data.dialog).height() + "px",
                        opacity: opacity
                    }, 250, function() {
                        data.isActive = false;

                        $(data.dialog).hide();

                        if(STACK.length == 0) {
                            $.overlay.hide();
                        }

                        invokeCloseEvents();

                        if (options.destroyOnClose) {
                            $(self).modalDialog("destroy");
                        }
                    });
                },

                destroy: function () {
                    restoreReferences(this);
                    var self = this;
                    if (!data)
                        return;

                    $(data.dialog).remove();
                }
            };

            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(
                    arguments, 1));
            } else {
                methods.init.apply(this, arguments);
            }
            return this;
        };
    })(jQuery);

    /* toolbar */
    (function ($) {

        function Toolbar() {};

        Toolbar.prototype = {
            init: function (element, options) {
                this.element = element;
                this.options = $.extend({

                }, options);

                $(element).addClass("toolbar");
            },

            adds: {
                button: function(button) {
                    var buttonElement = _E("a")
                        .attr("href", "javascript:;")
                        .attr('group', button.group)
                        .addClass("btn btn-sm btn-default ml10")
                        .appendTo(this.element);

                    if (button.icon) {
                        $(buttonElement).prepend(
                            _E("i")
                                .addClass("glyphicon glyphicon-" + button.icon)
                        );
                    }

                    if(button.text) {
                        $(buttonElement).append(" " + button.text);
                    }

                    $(buttonElement).click(function () {
                        if (button.command)
                            button.command();
                    });

                    if (button.hidden) {
                        buttonElement.hide();
                    }
                },

                menu: function(button) {
                    var divElement = _E("div")
                            .addClass("btn-group")
                            .appendTo(this.element)
                            .attr('group', button.group)
                        ;

                    var buttonElement = _E("a")
                        .attr("data-toggle", "dropdown")
                        .attr("href", "javascript:;")
                        .attr("data-toggle", "dropdown")
                        .addClass("dropdown-toggle")
                        .addClass("btn btn-sm btn-default ml10")
                        .appendTo(divElement);

                    if (button.icon) {
                        $(buttonElement).prepend(
                            _E("i")
                                .addClass("glyphicon glyphicon-" + button.icon)
                        );
                    }

                    if(button.text) {
                        $(buttonElement).append(" " + button.text);
                    }

                    $(buttonElement).append(_E("b").addClass("caret ml5"));

                    if(!button.items) {
                        throw "Please specify items for menu type toolbar buttons";
                    }

                    var itemsElement = _E("ul")
                        .addClass("dropdown-menu")
                        .appendTo(divElement);

                    if (button.alignRight) {
                        itemsElement
                            .css("left", "auto")
                            .css("right", "0px");
                    }

                    core.utils.each(button.items, function(item) {
                        if (item.separator) {
                            var itemElement = _E("li")
                                .addClass("divider")
                                .appendTo(itemsElement);
                        } else {
                            var itemElement = _E("li")
                                .append(
                                _E("a")
                                    .attr("href", "javascript:;")
                                    .text(item.label)
                                    .click(function () {
                                        if ($.isFunction(item.command)) {
                                            item.command.call(divElement);
                                        }
                                    })
                            )
                                .appendTo(itemsElement);

                            if (item.important) {
                                itemElement.addClass("important");
                            }
                        }
                    });

                    if (button.hidden) {
                        divElement.hide();
                    }
                }
            },

            add: function (button) {
                if(!button.type) {
                    button.type = "button";
                }

                var addFn = this.adds[button.type];
                if(addFn) {
                    addFn.call(this, button);
                }
            },
            /*
             showGroups: function (groups) {
             var self = this;
             $(self.element).find('[group~="' + groups + '"]').each(function () {
             if (!$(this).is(":visible")) {
             $(this).stop().show("slide", 250);
             }
             });
             },

             hideGroups: function (groups) {
             var self = this;
             $(self.element).find('[group~="' + groups + '"]').each(function () {
             if ($(this).is(":visible")) {
             $(this).stop().hide("slide", 250);
             }
             });
             },
             */
            clear: function () {
                $(this.element).empty();
            }
        };

        $.fn.toolbar = function (options) {
            var toolbar = $(this).data("toolbar");
            if (options === "isToolbar")
                return toolbar ? true : false;

            if (!toolbar) {
                toolbar = new Toolbar();
                $(this).data("toolbar", toolbar);

                toolbar.init(this, options);
            } else {
                var method = Toolbar.prototype[options];
                if (method) {
                    method.apply(toolbar, Array.prototype.slice.call(arguments, 1));
                }
            }
        };

    })(jQuery);

    /* btnbar */
    (function ($) {

        function Btnbar() {};

        Btnbar.prototype = {
            init: function (element, options) {
                this.element = element;
                this.options = $.extend({

                }, options);

                $(element).addClass("btnbar");
            },

            getGroup: function(group) {
                if(!group) {
                    group = "_default_";
                }

                var ge = $(this.element).find(core.utils.format("div[data-group='{0}']", group));
                if(ge.size() == 0) {
                    ge = _E("div")
                        .addClass("btn-group")
                        .attr("data-group", group)
                        .appendTo(this.element);
                }

                return ge;
            },

            add: function (button) {
                button = $.extend({
                    type: "button"
                }, button);

                var group = this.getGroup(button.group);

                var buttonElement = _E("button")
                    .addClass("btn")
                    .appendTo(group);

                if (button.icon) {
                    $(buttonElement).append(_E("i").addClass("glyphicon glyphicon-" + button.icon));
                }

                if(button.text) {
                    $(buttonElement).append(button.text);
                }

                if (button.type == "menu") {
                    if (!button.items)
                        throw "Button of type 'menu' require menu items";
                    $(buttonElement).btnbarSubMenu(button);
                } else {
                    $(buttonElement).click(function () {
                        if (button.command)
                            button.command();
                    });
                }

                if (button.hidden) {
                    liElement.hide();
                }
            },

            showGroups: function (groups) {
                var self = this;
                $(self.element).find('li[group~="' + groups + '"]').each(function () {
                    if (!$(this).is(":visible")) {
                        $(this).stop().show("slide", 250);
                    }
                });
            },

            hideGroups: function (groups) {
                var self = this;
                $(self.element).find('li[group~="' + groups + '"]').each(function () {
                    if ($(this).is(":visible")) {
                        $(this).stop().hide("slide", 250);
                    }
                });
            },

            clear: function () {
                $(this.element).empty();
            }
        };

        $.fn.btnbar = function (options) {
            var btnbar = $(this).data("btnbar");
            if (options === "isBtnbar")
                return btnbar ? true : false;

            if (!btnbar) {
                btnbar = new Btnbar();
                $(this).data("btnbar", btnbar);

                btnbar.init(this, options);
            } else {
                var method = Btnbar.prototype[options];
                if (method) {
                    method.apply(btnbar, Array.prototype.slice.call(arguments, 1));
                }
            }
        };

    })(jQuery);


    /*
     * Breadcrumbs
     */
    (function ($) {

        function Breadcrumbs() {};

        Breadcrumbs.prototype = {

            init: function (element, options) {
                this.element = element;
                this.options = $.extend(options, { });
            },

            add: function (breadcrumb) {
                var li = _E('li');
                var item;

                if (breadcrumb.pageTitle) {
                    item = _E("a")
                        .attr("href", "javascript:;")
                        .click(function() { location.href = location.href; })
                        .addClass("page-title")
                        .text(breadcrumb.pageTitle)
                    li.addClass("crumb-active");
                } else if (breadcrumb.icon) {
                    if (!breadcrumb.href) { breadcrumb.href = BASE; }
                    item = _E("a").attr("href", breadcrumb.href).append(_E("span").addClass(breadcrumb.icon));
                    li.addClass("crumb-icon")
                } else if (!breadcrumb.href || breadcrumb.selected) {
                    item = _E("span").text(breadcrumb.label);
                    li.addClass("active");
                } else if (breadcrumb.href) {
                    item = _E('a')
                        .attr('href', breadcrumb.href)
                        .text(breadcrumb.label);
                } else if (breadcrumb.command) {
                    item = _E('a')
                        .text(breadcrumb.label)
                        .attr('href', 'javascript:;')
                        .data('item', breadcrumb)
                        .click(function () {
                            $(this).data('item').command();
                        });
                }

                var size = $(this.element).find("li").size();
                if(size > 0) {
                    //li.append(_E("span").addClass("divider").text("/"));
                }

                li.append(item).appendTo(this.element);
            },

            addAll: function (breadcrumbs) {
                var size = breadcrumbs.length;
                for (var i = 0; i < size; i++) {
                    this.add(breadcrumbs[i]);
                }
            },

            clear: function () {
                $(this.element).empty();
            }
        };

        $.fn.breadcrumbs = function (options) {
            var breadcrumbs = $(this).data("breadcrumbs");
            if (options === "isBreadcrumbs")
                return breadcrumbs ? true : false;

            if (!breadcrumbs) {
                breadcrumbs = new Breadcrumbs();
                $(this).data("breadcrumbs", breadcrumbs);

                breadcrumbs.init(this, options);
            } else {
                var method = Breadcrumbs.prototype[options];
                if (method) {
                    method.apply(breadcrumbs, Array.prototype.slice.call(arguments, 1));
                }
            }
        };
    })(jQuery);
});