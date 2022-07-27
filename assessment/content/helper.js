function apiFetch(url, callback, options={method: "GET"}) {
    fetch(url, options).then(response => response.json()).then(callback);
}

function throttle(interval, callback) {
    var timeoutId = undefined;
    return () => {
        if (timeoutId === undefined) {
            timeoutId = setTimeout(() => {
                callback();
                timeoutId = undefined;
            }, interval);
        }
    };
}

function htmlEscape(text) {
    return text?.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
