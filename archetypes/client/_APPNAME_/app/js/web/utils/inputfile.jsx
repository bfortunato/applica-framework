import _ from "underscore";

export function cleanedData(data) {
    if (_.isEmpty(data)) {
        return null
    }
    let search = ";base64,"
    let index = data.indexOf(search)
    if (index == -1) {
        return null
    }

    let startIndex = index + search.length
    return data.substring(startIndex)
}

export function dataUrl(data, format) {
    return "data;base64," + data
}

function _unchangedData(data) {
    return data
}

function _readDataInternal(file, cleaner) {
    return new Promise((resolve, reject) => {
        try {
            let reader = new FileReader()
            reader.onload = (e) => {
                resolve(cleaner(e.target.result))
            }
            reader.readAsDataURL(file)
        } catch(e) {
            reject(e)
        }
    })
}

export function readData(file) {
    return _readDataInternal(file, cleanedData)
}

export function readDataUrl(file) {
    return _readDataInternal(file, _unchangedData)
}