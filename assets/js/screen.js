const PRE = "DELTA"
const SUF = "MEET"
var room_id;
var pass_room;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var peerScreen = null;
var currentPeer = null
var screenPeer = null;
var screenSharing = false
var myStream;
const urlParams = new URLSearchParams(window.location.search);
const roomInfo = JSON.parse(localStorage.getItem('room_info'));
const screenVideoElement = document.querySelector('#screen-video');
const screenVideoBlock = document.querySelector('#screen-video-block');

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
        // hideModal()
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            myStream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        notify("Waiting for peer to join.")
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
    video.play();
}

function setScreenStream(stream) {
    let video = document.getElementById("screen-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

function turnOffCamera() {
    var vidTrack = myStream.getVideoTracks();
    vidTrack.forEach(track => track.stop());
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
            setLocalStream(local_stream)
            notify("Joining peer")
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