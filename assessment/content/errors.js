function isAccessDenied() {
    return window.location.href.endsWith('?error=access+denied');
}
function isUsernameInUse() {
    return window.location.href.endsWith('?error=already+used');
}
