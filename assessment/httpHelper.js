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

// For forms with application/x-www-form-urlencoded content type, the body is a string of the form field1=value1&field2=value2&...
// This function does not work with anything else!
function parseFormData(data) {
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

exports.parseFormData = parseFormData;
