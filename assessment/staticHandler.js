import * as fs from 'fs';
import * as path from 'path';

export function handle(request, result, url) {
    let pathname = url.pathname;
    if (pathname === '/') {
        pathname = '/index.html';
    }
    const filePath = './content' + pathname;
    fs.readFile(filePath, function (err, data) {
        if (err) {
            result.writeHead(404, { 'Content-Type': 'text/plain' });
            result.end('404 Not Found');
        } else {
            result.writeHead(200, { 'Content-Type': getContentType(pathname) });
            result.end(data);
        }
    });
}

// Find the content-type value for the file extension.
// If the file extension is not found, return 'text/plain'
function getContentType(filePath) {
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.wav': 'audio/wav',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'font/eot',
        '.otf': 'font/otf',
        '.otf2': 'font/otf',
        '.ico': 'image/x-icon',
        '.xml': 'text/xml',
        '.xhtml': 'application/xhtml+xml',
        '.webp': 'image/webp',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg'
    };
    const extension = path.extname(filePath);
    return contentTypes[extension] || 'text/plain';
}
