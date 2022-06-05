function apiFetch(url, callback) {
    fetch(url).then(response => response.json()).then(callback);
}
