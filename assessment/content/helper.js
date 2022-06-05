function apiFetch(url, callback) {
    fetch(url).then(response => response.json()).then(callback);
}

function debounce(delay = 250) {
    var timeout; // Allow us to cancel previous timeouts
    return (func) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func();
        }, delay);
    };
}
