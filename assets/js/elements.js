const tablinksElements = document.querySelectorAll('.tablinks');
const screenJoinRoomForm = document.querySelector('#join-room-form');
const screenJcreateRoomForm = document.querySelector('#create-room-form');

screenJcreateRoomForm.style.display = 'none';

tablinksElements.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === 0) {
            tablinksElements[1].classList.remove('active');
            item.classList.add('active');
            screenJoinRoomForm.style.display = 'block';
            screenJcreateRoomForm.style.display = 'none';
        } else {
            tablinksElements[0].classList.remove('active');
            item.classList.add('active');
            screenJoinRoomForm.style.display = 'none';
            screenJcreateRoomForm.style.display = 'block';
        }
    })
});