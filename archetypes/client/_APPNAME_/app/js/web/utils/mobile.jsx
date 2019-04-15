export function isAndroid() {
    return navigator.userAgent.match(/Android/i);
}

export function isiOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

export function isOpera() {
    return navigator.userAgent.match(/Opera Mini/i);
}

export function isBlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
}

export function isWindows() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
}

export function isMobile() {
    return (isAndroid() || isBlackBerry() || isiOS() || isOpera() || isWindows());
}