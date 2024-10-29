// 使用 Node.js 和 WebSocket 套件建立 WebSocket 伺服器
const WebSocket = require('ws'); // 引入WebSocket模組
const wss = new WebSocket.Server({ port: 8080 }); // 建立WebSocket伺服器並監聽8080埠

let messages = []; // 全域變數儲存所有留言

// 當有新使用者連接時觸發
wss.on('connection', (ws) => {
    // 當前連線的使用者初始化時，傳送所有留言給該使用者
    ws.send(JSON.stringify({ type: 'init', data: messages }));

    // 接收使用者的新留言
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message); // 解析接收到的JSON訊息

        // 若訊息為新留言，將其儲存並廣播給所有連線使用者
        if (parsedMessage.type === 'newMessage') {
            messages.push(parsedMessage.data); // 儲存留言
            broadcast(JSON.stringify({ type: 'update', data: parsedMessage.data })); // 廣播新留言
        }
    });
});

// 廣播函式：將新留言傳送給所有使用者
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data); // 傳送資料給所有連線使用者
        }
    });
}

console.log('WebSocket server running on ws://localhost:8080');