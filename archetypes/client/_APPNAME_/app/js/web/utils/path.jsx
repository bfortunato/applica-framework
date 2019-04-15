function extension(filename) {
    var lastIndexOfDot = filename.lastIndexOf('.');
    if (lastIndexOfDot === -1) {
        return '';
    }
    return filename.substr(lastIndexOfDot + 1).toLowerCase();
}

function basename(filename) {
    var fileExtension = this.extension(filename);
    if (!Boolean(fileExtension)) {
        return filename;
    }
    return filename.substr(0, filename.lastIndexOf('.'));
}

function removeSuffix(filename) {
    return this.removeSuffixWithDelimiter('.', filename);
}

function removeSuffixWithDelimiter(delimiter, filename) {
    var fileExtension = this.extension(filename);
    var fileBasename = this.basename(filename);
    var lastIndexOfDelimiter = fileBasename.lastIndexOf(delimiter);
    if (lastIndexOfDelimiter === -1) {
        return filename;
    }
    return fileBasename.substr(0, lastIndexOfDelimiter) + '.' + fileExtension;
}

function appendSuffix(suffix, filename) {
    return this.appendSuffixWithDelimiter(suffix, '.', filename)
}

function appendSuffixWithDelimiter(suffix, delimiter, filename) {
    if (Object.prototype.toString.call(suffix) !== '[object Array]' ) {
        suffix = [suffix];
    }

    var fileExtension = this.extension(filename);
    var newFilename = [this.basename(filename), delimiter].concat(suffix.join(delimiter));

    if (fileExtension) {
        newFilename.push('.');
        newFilename.push(fileExtension);
    }

    return newFilename.join('');
}


function directoryName(filename) {
    if (!this.extension(filename)) {
        return filename;
    }
    return filename.substr(0, filename.lastIndexOf('/'));
}

exports.extension = extension;
exports.basename = basename;
exports.removeSuffix = removeSuffix;
exports.removeSuffixWithDelimiter = removeSuffixWithDelimiter;
exports.appendSuffix = appendSuffix;
exports.appendSuffixWithDelimiter = appendSuffixWithDelimiter;
exports.directoryName = directoryName;
