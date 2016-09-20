/**
 * Applica (www.applica.guru).
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 1:25 PM
 * Applica
 */

define(["framework/core", "framework/ui"], function(core, ui) {

    var exports = {};

    var AjaxService = core.AObject.extend({
        ctor: function() {
            this.data = {};
            this.url = null;
            this.method = "GET";
            this.dataType = "json";
            //this.contentType = "application/json";
        },

        load: function() {
            var self = this;
            $.ajax({
                type: this.method,
                traditional: true,
                url: this.url,
                data: this.data,
                contentType: this.contentType,
                dataType: this.dataType,
                success: function(response) {
                    self.onSuccess(response);
                },
                error: function() {
                    self.onError(msg.MSG_LOAD_ERROR);
                }
            });
        },

        onSuccess: function(response) {
            var self = this;
            if(response.error) {
                self.invoke("error", response.message);
                return;
            }

            var data = response.value;
            self.invoke("load", data);
        },

        onError: function(error) {
            this.invoke("error", error);
        }
    });



    var AfterActionExecutor = core.AObject.extend({
        ctor: function(command) {
            AfterActionExecutor.super.ctor.call(this);

            this.command = command;
            this.commands = {
                redirect: function(value) {
                    location.href = BASE + value;
                },

                command: function(value) {
                    ui.CommandsManager.instance().invoke(value);
                }
            };
        },

        execute: function() {
            if(!core.utils.stringIsNullOrEmpty(this.command)) {
                var split = this.command.split(":");
                if(!split.size == 2) {
                    return;
                }
                var command = split[0];
                var value = split[1];
                var fn = this.commands[command];
                if($.isFunction(fn)) {
                    fn(value);
                }
            }
        }
    });



    var FormService = core.AObject.extend({
        ctor: function() {
            FormService.super.ctor.call(this);

            this.method = "GET";
            this.url = null;
            this.data = {};
            this.identifier = null;
            this.title = null;
        },

        load: function() {
            var self = this;

            if(!this.url) throw "FormService.load(): url is needed";

            self.element = null;
            $.ajax({
                type: this.method,
                url: this.url,
                data: this.data,
                dataType: 'json',
                success: function(response) {
                    if(response.error) {
                        self.invoke("error", response.message);
                    }
                    else {
                        self.element = _E("div").html(response.content);
                        self.title = response.title;

                        self.invoke("load", self.element);
                    }
                },
                error: function() {
                    self.invoke("error", "generic error");
                }
            });
        },

        performAction: function(data) {
            var self = this;
            var url = this.action;
            var options = {
                method: 'POST',
                url: url,
                data: data
            };

            $.ajax({
                type: options.method,
                url: options.url,
                data: options.data,
                dataType: "json",
                success: function(response) {
                    if(response.error) {
                        self.invoke("error", response.message);
                    } else if(!response.valid) {
                        self.invoke("validationError", response.validationResult);
                    } else {
                        self.invoke("complete");

                        if(response.after) {
                            var executor = new AfterActionExecutor(response.after);
                            executor.execute();
                        }
                    }
                },
                error: function() {
                    self.invoke("error", "generic error");
                }
            });
        },

        save: function(data) {
            var self = this;
            if(!this.identifier) {
                throw "Please specify an identifier in formService to save";
            }

            var url = BASE + "crud/form/" + this.identifier + "/save";

            var options = {
                method: 'POST',
                url: url,
                data: data
            };

            $.ajax({
                type: options.method,
                url: options.url,
                data: options.data,
                dataType: "json",
                success: function(response) {
                    if(response.error) {
                        self.invoke("error", response.message);
                    } else if(!response.valid) {
                        self.invoke("validationError", response.validationResult);
                    } else {
                        self.invoke("save");
                    }
                },
                error: function() {
                    self.invoke("error", "generic error");
                }
            });
        }
    });










    var GridService = core.AObject.extend({
        ctor: function() {
            this.loadRequest = {
                filters: [],
                page: 1,
                sorts: null
            };
            this.method = "GET";
            this.url = null;
            this.data = {};
            this.sort = [];
            this.element = null;
            this.formIdentifier = null;
            this.identifier = null;
            this.title = null;
            this.searchFormIncluded = false;
        },

        load: function(opts) {
            var self = this;

            if(!this.url) throw "GridService.load(): url is needed";

            self.element = null;
            $.ajax({
                type: this.method,
                url: this.url,
                data: $.extend(this.data, { loadRequest: JSON.stringify(this.loadRequest) }),
                dataType: "json",
                success: function(response) {
                    self.element = null;

                    if(response.error) {
                        self.invoke("error", response.message);
                    } else {
                        self.element = _E("div").html(response.content);
                        self.formIdentifier = response.formIdentifier;
                        self.title = response.title;
                        self.searchFormIncluded = response.searchFormIncluded;

                        self.invoke("load", self.element);
                    }
                },
                error: function() {
                    self.invoke("error", "generic error");
                }
            });

        },

        remove: function(ids) {
            if(!this.identifier) {
                throw "Please specify an identifier in gridService to remove";
            }

            if(!ids || ids.length == 0) {
                return;
            }
            var url = BASE + "crud/grid/" + this.identifier + "/delete";
            var self = this;
            $.ajax({
                type: "POST",
                url: url,
                data: { ids: ids.join() },
                dataType: "json",
                success: function(response) {
                    if(response.error) {
                        self.invoke("error", response.message);
                    } else {
                        self.invoke("remove", ids);
                    }
                },
                error: function() {
                    self.invoke("error", "generic error");
                }
            });
        },

        reload: function() {
            this.load(this.options);
        },

        setPage: function(page) {
            this.loadRequest.page = page;
        },

        nextPage: function() {
            this.loadRequest.page++;
        },

        previousPage: function() {
            this.loadRequest.page--;
            if(this.loadRequest.page <= 0) {
                this.loadRequest.page = 1;
            }
        },

        setSort: function(property, descending) {
            this.loadRequest.sorts = [{
                property: property,
                descending: descending
            }];
        },

        setFilters: function(filters) {
            this.loadRequest.filters = filters;
            this.loadRequest.page = 1;
        }
    });




    var DateInterval = core.AObject.extend({
        ctor: function() {
            DateInterval.super.ctor.call(this);

            this.from = 0;
            this.to = 0;
        },

        set_to: function(to) {
            this.to = to;
            this.check();
        },

        set_from: function(from) {
            this.from = from;
            this.check();
        },

        initLastHour: function() {
            this.to = new Date().getTime();
            this.from = this.to - 60 * 60 * 1000;

            this.invoke("to_change");
            this.invoke("from_change");
        },

        initLastDay: function() {
            this.initTo(new Date().getTime(), 1);
        },

        initLastWeek: function() {
            var now = new Date();
            this.initTo(now, now.getDay());
        },

        initFrom: function(from, days) {
            this.from = from;

            var dateTo = new Date();
            dateTo.setTime(this.from);
            dateTo.setDate(dateTo.getDate() + days);
            this.to = dateTo.getTime();

            this.invoke("to_change");
            this.invoke("from_change");
        },

        initTo: function(to, days) {
            this.to = to;

            var dateFrom = new Date();
            dateFrom.setTime(this.to);
            dateFrom.setDate(dateFrom.getDate() - days);
            this.from = dateFrom.getTime();

            this.invoke("to_change");
            this.invoke("from_change");
        },

        subFrom: function(days) {
            var dateFrom = new Date();
            dateFrom.setTime(this.from);
            dateFrom.setDate(dateFrom.getDate() - days);
            this.from = dateFrom.getTime();
            this.check();
        },

        addFrom: function(days) {
            var dateFrom = new Date();
            dateFrom.setTime(this.from);
            dateFrom.setDate(dateFrom.getDate() + days);
            this.from = dateFrom.getTime();
            this.check();
        },

        subTo: function(days) {
            var dateTo = new Date();
            dateTo.setTime(this.to);
            dateTo.setDate(dateTo.getDate() - days);
            this.to = dateTo.getTime();
            this.check();
        },

        addTo: function(days) {
            var dateTo = new Date();
            dateTo.setTime(this.to);
            dateTo.setDate(dateTo.getDate() + days);
            this.to = dateTo.getTime();
            this.check();
        },

        check: function() {
            if(!this.from || !this.to) { return; }

            if(this.from > this.to) {
                throw "Error normalizing dates: from is greater than to";
            }
        },

        normalize: function() {
            if(this.from) {
                var dateFrom = new Date();
                dateFrom.setTime(this.from);
                dateFrom.setHours(0);
                dateFrom.setMinutes(0);
                dateFrom.setSeconds(0);
                dateFrom.setMilliseconds(0);
                this.set("from", dateFrom.getTime());
            }

            if(this.to) {
                var dateTo = new Date();
                dateTo.setTime(this.to);
                dateTo.setHours(23);
                dateTo.setMinutes(59);
                dateTo.setSeconds(59);
                dateTo.setMilliseconds(999);
                this.set("to", dateTo.getTime());
            }
        }
    });


    var QueryStringLoadRequest = core.AObject.extend({
        ctor: function() {
            this.filters = [];
            this.sorts = [];
            this.page = 1;
        },

        data: function() {
            return {
                filters: this.filters,
                sorts: this.sorts,
                page: this.page
            }
        },

        parse: function(filters) {
            var self = this;
            core.utils.each(filters, function(filter) {
                if (filter.indexOf(QueryStringLoadRequest.FILTER_PREFIX) == 0) {
                    var val = filters[filter];
                    var property = filter.substring(QueryStringLoadRequest.FILTER_PREFIX.length);
                    var type = "eq";
                    if (property.indexOf(QueryStringLoadRequest.FILTER_TYPE_SEPARATOR) != -1) {
                        var split = property.split(QueryStringLoadRequest.FILTER_TYPE_SEPARATOR);
                        property = split[0];
                        type = split[1];
                    }
                    self.filters.push({ property: property, value: val, type: type })
                }
            });
        }
    });

    QueryStringLoadRequest.FILTER_PREFIX = "_f_";
    QueryStringLoadRequest.FILTER_TYPE_SEPARATOR = "$";
    QueryStringLoadRequest.LIKE = "like";
    QueryStringLoadRequest.GT = "gt";
    QueryStringLoadRequest.GTE = "gte";
    QueryStringLoadRequest.LT = "lt";
    QueryStringLoadRequest.LTE = "lte";
    QueryStringLoadRequest.EQ = "eq";
    QueryStringLoadRequest.IN = "in";
    QueryStringLoadRequest.NIN = "nin";
    QueryStringLoadRequest.ID = "id";
    QueryStringLoadRequest.OR = "or";
    QueryStringLoadRequest.CUSTOM = "custom";
    QueryStringLoadRequest.RANGE = "range";

    QueryStringLoadRequest.parse = function(filters) {
        var l = new QueryStringLoadRequest();
        l.parse(filters);
        return l.data();
    };

    exports.AjaxService = AjaxService;
    exports.GridService = GridService;
    exports.FormService = FormService;
    exports.DateInterval = DateInterval;
    exports.QueryStringLoadRequest = QueryStringLoadRequest;

    return exports;
});