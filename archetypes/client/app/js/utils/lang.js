export function format(fmt, ...values) {
    var args = values;
    return fmt.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}