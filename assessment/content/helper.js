function apiFetch(url, callback, options={method: "GET"}) {
    fetch(url, options).then(response => response.json()).then(callback);
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
