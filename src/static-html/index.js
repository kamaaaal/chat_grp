////////chat app
function addMessage(message) {
  const messageBox = document.querySelector('.message-box');
  console.log('message to be added', message);
  const mess = document.createElement('p');
  mess.className = 'message-sent';
  mess.innerHTML = `[${message.name}] : ${message.message}`;
  messageBox.appendChild(mess);
}

const UserName = prompt('Enter User Name');

const socket = io('https://chatgrp-production.up.railway.app/:3000/');

socket.emit('userConnected', UserName);

socket.on('userConnected', (UserName) => {
  console.log('got user name ', UserName);
});

socket.on('message', (content) => console.log(content));
