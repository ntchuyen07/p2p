const params = new URLSearchParams(window.location.search);
const roomId = params.get('id');
const username = localStorage.getItem('username') || 'Đối phương';
const remoteUsername = document.querySelector('#remote-name');
const messageForm = document.querySelector('#message-form-id');
const messageList = document.querySelector('#message-list-id');
const userList = document.querySelector('.interaction-people-list');
const microBtn = document.querySelector('#micro-control');
const userAllRoomElements = document.querySelectorAll('.interaction-people-item');
const socketDomain = 'http://localhost:3000/';
// const socketDomain = 'https://mylife-node.herokuapp.com/';
const formFile = document.querySelector('#file-form-id');
const fileSelect = document.querySelector('#file-chatting');
const chatList = document.querySelector('.body-interaction-chatting');

const socket = io(socketDomain);

function runSocket(roomId, username) {
    socket.emit("join", { roomId: roomId, username: username });

    socket.on('allUser', data => {
        userList.innerHTML = '';
        addNewUser(username + ' (You)');
        const otherUsers = data.filter(item => item !== username);
        otherUsers.forEach(item => {
            addNewUser(item);
        })
    })

    socket.on('oldUser', data => {
        remoteUsername.innerHTML = data;
    })

    socket.on('newUser', data => {
        remoteUsername.innerHTML = data;
    })

    socket.on('newMessage', ({ message, username, type }) => {
        if (type === 'image') {
            addNewImage(message, username )
        } else if(type === 'message') {
            addNewMessage(message, username)
        } else {
            addNewFile(message, username )
        }
    })

    socket.on('switchMicro', (data) => {
        let remoteVideo = document.getElementById("remote-video");
        remoteVideo.muted = !remoteVideo.muted;
        console.log(remoteVideo);
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
    socket.emit('newMessage', { message, username, roomId, type: 'message' });
}

fileSelect.onchange = async function (e) {
    try {
        const file = fileSelect.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post(`${socketDomain}file/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        if(data?.file?.path.match(/.(jpg|jpeg|png|gif)$/i)) {
            addNewImage(data?.file?.path, "You")
            socket.emit('newMessage', { message: data?.file?.path, username, roomId, type: 'image' });
        } else {
            addNewFile(data?.file?.path, "You")
            socket.emit('newMessage', { message: data?.file?.path, username, roomId, type: 'file' });
        }
    } catch (error) {
        console.log(error);
    }
}

microBtn.onclick = function () {
    const imageMicro = this.querySelector('img');
    socket.emit('switchMicro', { username, roomId });
    if (this.classList.contains('active')) {
        imageMicro.src = './assets/images/micro.svg'
        this.classList.remove('active');
    } else {
        imageMicro.src = './assets/images/micro-off.svg'
        this.classList.add('active');
    }
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
    chatList.scrollTo(0, chatList.scrollHeight);

}

function addNewUser(name) {
    const firstLetter = name.substring(0, 1).toUpperCase() || 'H';
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const html = `
        <li class="interaction-people-item">
            <div>
            <div class="interaction-user-avatar" style="background: #${randomColor}" ><span>${firstLetter}</span></div>
                <span class="interaction-people-name">
                    ${name}
                </span>
            </div>
            <div>
                <img class="interaction-people-micro"  src="./assets/images/micro-off-dark.svg" alt="">
            </div>
        </li>
    `
    userList.insertAdjacentHTML('beforeend', html);
}

function addNewImage(path, username) {
    const today = new Date();
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    // const image = document.createElement('img');
    // image.src = "http://localhost:3000/uploads/1640186381839--ytuong.png";
    const html = 
    `<li class="interaction-chatting-message-item">
        <div class="chatting-message-info">
        <div class="chatting-message-username">${username}</div>
        <div class="chatting-message-time">${time}</div>
        </div>
        <div class="chatting-message-content">
            <a href="${socketDomain}${path}"  target="_blank">
                <img src="${socketDomain}${path}" alt="Ảnh" />
            </a>
        </div>
    </li>`

    messageList.insertAdjacentHTML('beforeend', html);
    chatList.scrollTo(0, chatList.scrollHeight);
}

function addNewFile(path, username) {
    const today = new Date();
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    // const image = document.createElement('img');
    // image.src = "http://localhost:3000/uploads/1640186381839--ytuong.png";
    const html = 
    `<li class="interaction-chatting-message-item">
        <div class="chatting-message-info">
        <div class="chatting-message-username">${username}</div>
        <div class="chatting-message-time">${time}</div>
        </div>
        <div class="chatting-message-content">
            <a href="${socketDomain}${path}" target="_blank">${path.substring(9)}</a>
        </div>
    </li>`

    messageList.insertAdjacentHTML('beforeend', html);
    chatList.scrollTo(0, chatList.scrollHeight);
}
