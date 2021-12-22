const cameraBtn = document.querySelector('#camera-control');
const controlBtn = document.querySelectorAll('.room-control-item');
const captionBtn = controlBtn[2];
const presentBtn = controlBtn[3];
const settingBtn = controlBtn[4];
const interactionCloseBtn = document.querySelector('.body-interaction-close-btn');
const bodyInteraction = document.querySelector('.body-interaction');
const interactionControlBtn = document.querySelectorAll('.room-interact-control-item');
const searchPeopleInput = document.querySelector('.interaction-people-search-block > input');
const interactionTitle = document.querySelector('.body-interaction-title');
const bodyInteractionItem = document.querySelectorAll('.body-interaction-content');

let isBodyInteractionActive = false;

cameraBtn.onclick = function () {
  const imageCamera = this.querySelector('img');
  if (this.classList.contains('active')) {
    imageCamera.src = './assets/images/camera.svg'
    this.classList.remove('active');
  } else {
    imageCamera.src = './assets/images/camera-off.svg'
    this.classList.add('active');
  }
}

// Turn on caption button click
captionBtn.onclick = function () {
  this.querySelector('i').classList.toggle('fas');
  this.classList.toggle('caption-active');
}

presentBtn.onclick = showSubMenu.bind(presentBtn);
settingBtn.onclick = showSubMenu.bind(settingBtn);

function showSubMenu() {
  const subMenus = document.querySelectorAll('.sub-menu');
  subMenus.forEach(menu => {
    if (menu.parentElement !== this) {
      return menu.classList.remove('active');
    }
  });
  this.querySelector('.sub-menu').classList.toggle('active');
}

interactionCloseBtn.onclick = closeBodyInteraction.bind(interactionCloseBtn);
bodyInteraction.style.display = 'none';

function closeBodyInteraction() {
  removeInteractControl();
  bodyInteraction.classList.add('close');
  isBodyInteractionActive = false;
  setTimeout(function () {
    bodyInteraction.style.display = 'none';
  }, 100)
}

interactionControlBtn.forEach((interactBtn, index) => {
  interactBtn.onclick = function () {
    switch (index) {
      case 0:
        renderInteractionBody('details');
        console.log(index);
        break;
      case 1:
        renderInteractionBody('people');
        break;
      case 2:
        renderInteractionBody('chatting');
        break;
      case 3:
        renderInteractionBody('activity');
        break;
    }

    bodyInteractionItem[index].classList.remove('body-interaction-content');

    if (isBodyInteractionActive) {
      if (this.classList.contains('active')) {
        closeBodyInteraction();
        removeInteractControl();
      } else {
        isBodyInteractionActive = true;
        removeInteractControl();
        this.classList.add('active');
        // render body interaction
      }
    } else {
      isBodyInteractionActive = true;
      this.classList.add('active');
      bodyInteraction.classList.remove('close');
      bodyInteraction.style.display = 'block';
    }
  }
})

function removeInteractControl() {
  interactionControlBtn.forEach(item => item.classList.remove('active'));
}

searchPeopleInput.onfocus = function () {
  this.parentElement.classList.add('focus');
}

searchPeopleInput.addEventListener('focusout', function () {
  this.parentElement.classList.remove('focus');
})

function renderInteractionBody(type) {
  switch (type) {
    case 'details': {
      interactionTitle.innerHTML = 'Meeting details';
      hideAllInteractionBody();

      break;
    }
    case 'people': {
      interactionTitle.innerHTML = 'People';
      hideAllInteractionBody();
      break;
    }
    case 'chatting': {
      interactionTitle.innerHTML = 'Chat';
      hideAllInteractionBody();
      break;
    }
    case 'activity': {
      interactionTitle.innerHTML = 'Activity';
      hideAllInteractionBody();
      break;
    }
  }
}

function hideAllInteractionBody() {
  bodyInteractionItem.forEach(item => {
    if (!item.classList.contains('body-interaction-content')) {
      item.classList.add('body-interaction-content');
    }
  })
}

const time = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
document.querySelector('.time-web-room').textContent = time;
