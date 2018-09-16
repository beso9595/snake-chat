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

function getLogs() {
    let arr = [], i = 1, log;
    while (true) {
        log = document.getElementById('log-' + i++);
        if (log) {
            arr.push(log);
        } else {
            break;
        }
    }
    return arr;
}

function shiftMessages() {
    let logArray = getLogs();
    if (logArray.length !== 0) {
        let node;
        for (let i = 0; i < logArray.length; i++) {
            if (logArray[i].childElementCount > 3) {
                node = logArray[i].firstElementChild;
                if (i !== logArray.length - 1) {
                    logArray[i + 1].appendChild(node.cloneNode(true));
                }
                node.remove();
            }
        }
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
    let log1 = document.getElementById('log-1');
    log1.appendChild(msg);
    if (log1.childElementCount > 3) {
        shiftMessages();
    }
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