const http = require('http');
const fs = require('fs');
const Server = require('ws').Server;

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const server = new Server({ port: 5000 });
    server.on('connection', (webSocket) => {
        webSocket.on('message', (msg) => {
            const message = JSON.parse(msg);
            if (message) {
                console.log(message);
                switch (message.type) {
                    case 'join':
                        server.clients.forEach(client => {
                            client.send(JSON.stringify({
                                type: message.type,
                                user: message.date + '-id',
                                date: message.date
                            }));
                        });
                        break;
                    case 'message':
                        server.clients.forEach(client => {
                            client.send(JSON.stringify({
                                type: message.type,
                                user: message.user,
                                text: message.text
                            }));
                        });
                        break;
                }
            }
        });
    });
    server.on('error', (webSocket, error) => {
        console.log(error);
    });

    fs.readFile('index.html', 'utf8', function (err, html) {
        if (err) {
            throw err
        }

        fileLoader([
            {
                url: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                type: 'css'
            },
            {
                url: 'style.css',
                type: 'css'
            },
            {
                url: 'script.js',
                type: 'js'
            }
        ], [], html, res);
    });
});

function fileLoader(filesArray, contentsArray, html, response) {
    if (filesArray.length > 0) {
        fs.readFile(filesArray[0].url, 'utf8', function (err, content) {
            if (err) {
                throw err
            }

            contentsArray.push({
                type: filesArray[0].type,
                content: content
            });
            filesArray.shift();
            fileLoader(filesArray, contentsArray, html, response);
        });
    } else {
        let styles = '';
        let scripts = '';
        contentsArray.forEach(item => {
            switch (item.type) {
                case 'css':
                    styles += item.content;
                    break;
                case 'js':
                    scripts += item.content;
                    break;
            }
        });
        html = html.replace('<style></style>', '<style>' + styles + '</style>');
        html = html.replace('<script></script>', '<script>' + scripts + '</script>');
        response.write(html);
        response.end();
    }
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});