// 引入 WebSocket 模組並建立伺服器
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let messages = []; // 全部留言暫存在伺服器記憶體

// 當新用戶連接時觸發
wss.on('connection', (ws) => {
    // 傳送現有的所有留言給新連接的使用者
    ws.send(JSON.stringify({ type: 'init', data: messages }));

    // 當用戶端傳送新留言時觸發
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'newMessage') {
            // 儲存新留言，並廣播給所有使用者
            messages.push(parsedMessage.data);
            broadcast(JSON.stringify({ type: 'update', data: parsedMessage.data }));
        }
    });
});

// 廣播函式，將新留言發送給所有已連線的用戶
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');