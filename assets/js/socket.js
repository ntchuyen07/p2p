const params = new URLSearchParams(window.location.search);
const roomId = params.get('id');
const username = localStorage.getItem('username') || 'Đối phương';
const remoteUsername = document.querySelector('#remote-name');
const messageForm = document.querySelector('#message-form-id');
const messageList = document.querySelector('#message-list-id');
const socketDomain = 'http://localhost:3000/';
// const socketDomain = 'https://mylife-node.herokuapp.com/';
const socket = io(socketDomain);

function runSocket(roomId, username) { 
    socket.emit("join", { roomId: roomId, username: username });
    socket.on('oldUser', data => {
        remoteUsername.innerHTML = data;
    })
    socket.on('newUser', data => {
        remoteUsername.innerHTML = data;
    })

    socket.on('newMessage', ({ message, username }) => {
        addNewMessage(message, username)
    })
}
runSocket(roomId, username);

messageForm.onsubmit = function (e) {
    e.preventDefault();
    const message = e.target.message.value;
    addNewMessage(message, 'You')
    messageForm.reset();
    const payload = { message, username, roomId };
    console.log(payload);
    socket.emit('newMessage', { message, username, roomId });
}

function addNewMessage(message, username) {
    const today = new Date();
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const html = `<li class="interaction-chatting-message-item">
        <div class="chatting-message-info">
        <div class="chatting-message-username">${username}</div>
        <div class="chatting-message-time">${time}</div>
        </div>
        <div class="chatting-message-content">
        ${message}
        </div>
    </li>`
    messageList.insertAdjacentHTML('beforeend', html);
}
