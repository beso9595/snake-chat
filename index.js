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
                }
            }
        });
    });
    server.on('error', (webSocket, error) => {
        console.log(error);
    });

    const html = fs.readFileSync('index.html');
    res.write(html);
    res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});