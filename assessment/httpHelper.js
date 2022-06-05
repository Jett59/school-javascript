function getRequestBody(request) {
    let content = '';
    request.on('data', chunk => {
        content += chunk;
    });
    let promise = new Promise((resolve, reject) => {
        request.on('end', () => {
            resolve(content);
        });
    });
    return promise;
}
exports.getRequestBody = getRequestBody;

function parseUrlEncodedList(data) {
    const parts = data.split('&');
    let keyValuePairs = {};
    for (var part of parts) {
        if (part.includes('=')) {
            const keyValue = part.split('=');
            const key = decodeURI(keyValue[0]);
            const value = decodeURI(keyValue[1]);
            keyValuePairs[key] = value;
        } else {
            const key = decodeURI(part);
            keyValuePairs[key] = '';
        }
    }
    return keyValuePairs;
}
exports.parseUrlEncodedList = parseUrlEncodedList;

function getCookies(request) {
    let cookieList = request.headers.cookie;
    if (cookieList === undefined) {
        return {};
    }
    const cookies = {};
    for (var cookie of cookieList.split(';')) {
        const cookieParts = cookie.split('=');
        const key = cookieParts[0].trim();
        const value = decodeURIComponent(cookieParts[1].trim());
        cookies[key] = value;
    }
    return cookies;
}
exports.getCookies = getCookies;

function createCookie(key, value, response) {
    let cookieList = response.getHeader('Set-Cookie');
    if (cookieList === undefined) {
        cookieList = [];
    }
    cookieList.push(`${key}=${encodeURIComponent(value)}; HttpOnly`);
    response.setHeader('Set-Cookie', cookieList);
}
exports.createCookie = createCookie;
