export function getRequestBody(request) {
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

// Wrapps decodeUriComponent but handles + characters.
export function decodeUriPart(part) {
    return decodeURIComponent(part.trim().replace(/\+/g, '%20'));
}

export function parseUrlEncodedList(data) {
    const parts = data.split('&');
    let keyValuePairs = {};
    for (var part of parts) {
        if (part.includes('=')) {
            const keyValue = part.split('=');
            const key = keyValue[0];
            const value = decodeUriPart(keyValue[1]);
            keyValuePairs[key] = value;
        } else {
            const key = decodeURI(part);
            keyValuePairs[key] = '';
        }
    }
    return keyValuePairs;
}

export function getCookies(request) {
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

export function createCookie(key, value, response) {
    let cookieList = response.getHeader('Set-Cookie');
    if (cookieList === undefined) {
        cookieList = [];
    }
    cookieList.push(`${key}=${encodeURIComponent(value)}; HttpOnly`);
    response.setHeader('Set-Cookie', cookieList);
}
