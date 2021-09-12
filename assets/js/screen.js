const PRE = "DELTA"
const SUF = "MEET"
var room_id;
var pass_room;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var currentPeer = null
var screenSharing = false
var isCameraOn = false;
var myStream;
const urlParams = new URLSearchParams(window.location.search);
const roomInfo = JSON.parse(localStorage.getItem('room_info'));
const screenVideoElement = document.querySelector('#screen-video');
const screenVideoBlock = document.querySelector('#screen-video-block');

// document.querySelector() -> sẽ lấy 1 element
// document.querySelectorAll() -> lấy tất cả element thoả điều kiện
// nếu id thì truyền vào #id. class thì .class, còn thẻ như là thẻ a, input,... thì truyền vào tên thẻ ('a')
// hoặc cũng có thể truyền kiểu nhiều cấp ('.class#id')
const controlCameraBtn = document.querySelector('#camera-control');
// thì muốn chỉnh sửa style của 1 phần tử thì element.style.ten-style = '';
// ví dụ: controlCameraBtn.style.display = 'none'

if(roomInfo.type == 'create') {
    createRoom();
} else {
    joinRoom();
}

function createRoom() {
    console.log("Creating Room")
    let room = urlParams.get('id');
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    peer = new Peer(room_id)
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            myStream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        currentPeer = call;
    })

}

function setLocalStream(stream) {
    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}
function setRemoteStream(stream) {
    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play()
        .then(_ => {
        })
        .catch(err => console.log(err));
}

function setScreenStream(stream) {
    let video = document.getElementById("screen-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room")
    let room = urlParams.get('id');
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    peer = new Peer()
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            myStream = stream;
            setLocalStream(local_stream)
            let call = peer.call(room_id, stream)
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
            currentPeer = call;
        }, (err) => {
            console.log(err)
        })

    })

}


function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        setScreenStream(screenStream);
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if (peer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
            screenSharing = true
            screenVideoBlock.style.display = 'block';
        }
    })
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false;
    screenVideoBlock.style.display = 'none';
    turnOnCamera();
}


function turnOffCamera() {
    let video = document.getElementById("local-video");
    const mediaStream = video.srcObject;

    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    mediaStream.getTracks().forEach(function (track) {
        track.stop();
    });

    let videoTrack = mediaStream.getVideoTracks()[0];
        if (peer) {
            console.log(mediaStream);
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
        }
  
}

function turnOnCamera() {
    getUserMedia({ video: true, audio: true }, (stream) => {
        local_stream = stream;
        myStream = stream;
        setLocalStream(local_stream)
    }, (err) => {
        console.log(err)
    })
}

// thêm sự kiện cho 1 element
// ở đây muốn click nên là điền tên sự kiện là click
controlCameraBtn.addEventListener('click', function() {
    let video = document.getElementById("local-video");
    if(isCameraOn) {
        turnOffCamera();
    } else {
        turnOnCamera();
    }
    isCameraOn = !isCameraOn;
})