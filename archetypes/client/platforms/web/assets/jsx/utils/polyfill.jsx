String.prototype.format = function() {
    var args = arguments;

    return this.replace(/\{(\d+)\}/g, function() {
        return args[arguments[1]];
    });
};

String.prototype.contains = function(search) {
    if (!search) {
        return false;
    }

    return (this.indexOf(search) != -1);
};

