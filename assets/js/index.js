const host = 'https://ntchuyen07.github.io/p2p';
// const host = 'http://127.0.0.1:5500/ScreenSharing';
// const host = 'file:///F:/Javascript/FinalNP/ScreenSharing/';
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

function openTab(evt, cityName) {
  localStorage.setItem('join-room-form', cityName);
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
