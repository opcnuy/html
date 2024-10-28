const messagesList = document.getElementById('messagesList');
let filteredMessages = []; // 搜尋過濾後的留言
let currentPage = 1;       // 當前頁碼
const messagesPerPage = 10; // 每頁顯示留言數量

// 載入並顯示留言
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const currentTime = new Date().getTime();

    // 使用 filter 移除過期留言
    const validMessages = messages.filter((messageObj) => {
        return currentTime - messageObj.timestamp < 86400000;
    });

    // 更新 localStorage 中的有效留言
    localStorage.setItem('messages', JSON.stringify(validMessages));

    // 設置過濾後的留言
    filteredMessages = validMessages;
    renderMessages();
}

// 渲染當前頁面的留言
function renderMessages() {
    messagesList.innerHTML = ''; // 清空顯示區域

    // 計算分頁範圍
    const start = (currentPage - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const messagesToShow = filteredMessages.slice(start, end);

    // 顯示分頁留言
    messagesToShow.forEach(({ location, message, suitable, timestamp }) => {
        displayMessage(location, message, suitable, timestamp);
    });

    // 更新分頁按鈕狀態
    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = end >= filteredMessages.length;
}

// 顯示單個留言
function displayMessage(location, message, suitable, timestamp) {
    const messageItem = document.createElement('li');
    messageItem.classList.add('list-group-item');

    // 將時間戳轉換為可讀日期時間
    const date = new Date(timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    messageItem.innerHTML = `
        <em>${location}</em><br>
        ${message} <br>
        <span>是否適合打球: <strong>${suitable}</strong></span><br>
        <small>${formattedDate} ${formattedTime}</small>
    `;

    messagesList.prepend(messageItem);
}

// 搜尋並過濾留言
function filterMessages() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    filteredMessages = messages.filter(({ location, message }) => {
        return location.toLowerCase().includes(searchTerm) || message.toLowerCase().includes(searchTerm);
    });

    currentPage = 1; // 重置到第一頁
    renderMessages();
}

// 提交留言
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const location = document.getElementById('location').value.trim();
    const message = document.getElementById('message').value.trim();
    const suitable = document.getElementById('suitable').value;
    const timestamp = new Date().getTime();

    if (location && message && suitable) {
        // 儲存留言到 localStorage
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ location, message, suitable, timestamp });
        localStorage.setItem('messages', JSON.stringify(messages));

        // 更新留言並顯示
        loadMessages();

        // 清空表單
        document.getElementById('messageForm').reset();
        alert('留言成功！');
            loadMessages();
            
    }
});

// 下一頁
function nextPage() {
    if (currentPage * messagesPerPage < filteredMessages.length) {
        currentPage++;
        renderMessages();
    }
}

// 上一頁
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMessages();
    }
}

// 初始化時載入留言
loadMessages();