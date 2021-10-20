const host = 'https://ntchuyen07.github.io/p2p';
// const host = 'http://127.0.0.1:5500/ScreenSharing'
const createRoomForm = document.querySelector('#create-room-form');
const joinRoomForm = document.querySelector('#join-room-form');

createRoomForm.onsubmit = function(e) {
  e.preventDefault();
  const username = e.target.username.value;
  const roomInfo = {
    roomID: e.target.roomID.value,
    type: 'create'
  }
  localStorage.setItem('username', username);
  localStorage.setItem('room_info', JSON.stringify(roomInfo));
  window.location.replace(`${host}/main.html?id=${e.target.roomID.value}`);
}

console.log(joinRoomForm);

joinRoomForm.onsubmit = function(e) {
  e.preventDefault();
  const username = e.target.username.value;
  const roomInfo = {
    roomID: e.target.roomID.value,
    type: 'join'
  }
  localStorage.setItem('username', username);
  localStorage.setItem('room_info', JSON.stringify(roomInfo));
  window.location.replace(`${host}/main.html?id=${e.target.roomID.value}`);
}