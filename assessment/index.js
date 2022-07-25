import http from 'http';
import url from 'url';

import * as apiHandlers from './apiHandlers.js';
import * as staticHandler from './staticHandler.js';

function serverLoop(request, result) {
    const requestUrl = url.parse(request.url, true);
    const pathname = requestUrl.pathname;
    console.log(pathname);

    if (pathname.startsWith('/api/')) {
        apiHandlers.handle(request, result, requestUrl);
    } else {
        staticHandler.handle(request, result, requestUrl);
    }
}

console.log('Server running at http://localhost:8080/');
const server = http.createServer(serverLoop);
server.listen(8080);
