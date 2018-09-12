function getUsername() {
    return date + '-id';
}

function displayJoin(name) {
    if (name === getUsername()) {
        document.getElementById('name').appendChild(document.createTextNode(name));
    } else {
        doMessage('', name + ' has joined the chat');
    }
}

function doSend() {
    const message = document.getElementById('message').value;
    if (message) {
        ws.send(JSON.stringify({
            user: getUsername(),
            type: 'message',
            text: message
        }));
        document.getElementById('message').value = null;
    }
}

function doMessage(user, message) {
    const msg = document.createElement('TR');
    const author = document.createElement('TD');
    const text = document.createElement('TD');
    author.innerText = user + ': ';
    text.innerText = message;
    msg.appendChild(author);
    msg.appendChild(text);
    document.getElementById('first-log').appendChild(msg);
}

//

const ws = new WebSocket('ws://localhost:5000');
const date = new Date().getTime().toString();

ws.onopen = event => {
    console.log('opened..');

    ws.send(JSON.stringify({
        date: date,
        type: 'join'
    }));
};
ws.onclose = event => {
    console.log('closed..');
};
ws.onerror = e => {
    console.log('error..');
};
ws.onmessage = msg => {
    const message = JSON.parse(msg.data);
    if (message) {
        console.log(message);
        switch (message.type) {
            case 'join':
                displayJoin(message.user);
                break;
            case 'message':
                doMessage(message.user, message.text);
                break;
        }
    }
};