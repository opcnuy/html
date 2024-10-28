
const messagesList = document.getElementById('messagesList');

// 載入並顯示留言
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const currentTime = new Date().getTime();

    messages.forEach((messageObj, index) => {
        const {username, message, timestamp} = messageObj;
        
        // 檢查是否超過一天 (24小時 = 86400000毫秒)
        if (currentTime - timestamp < 86400000) {
            displayMessage(username, message, timestamp);
        } else {
            // 如果超過一天，從儲存中移除
            messages.splice(index, 1);
        }
    });

    // 更新儲存的留言
    localStorage.setItem('messages', JSON.stringify(messages));
}

// 顯示單個留言
function displayMessage(username, message, timestamp) {
    const messageItem = document.createElement('li');
    messageItem.classList.add('list-group-item');

    // 將時間戳轉換為可讀日期時間
    const date = new Date(timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    messageItem.innerHTML = `<strong>${username}</strong> : ${message}(${formattedDate} ${formattedTime})`;
    messagesList.appendChild(messageItem);
}

// 提交留言
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();
    const timestamp = new Date().getTime();

    if (username && message) {
        displayMessage(username, message, timestamp);

        // 儲存留言到 localStorage
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ username, message, timestamp });
        localStorage.setItem('messages', JSON.stringify(messages));

        // 清空表單
        document.getElementById('messageForm').reset();
    }
});

// 搜尋留言
function filterMessages() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    messagesList.innerHTML = ''; // 清空顯示區域

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(({ username, message, timestamp }) => {
        if (username.toLowerCase().includes(searchTerm) || message.toLowerCase().includes(searchTerm)) {
            displayMessage(username, message, timestamp);
        }
    });
}

// 初始化時載入留言
loadMessages();


