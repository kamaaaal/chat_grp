const username = prompt('Enter your name');
const room = prompt('Enter room name you want to join');
const socket = io('https://https://chatgrp-production.up.railway.app/chat2', {
  query: `username=${username}&room=${room}`,
});
// const socket = io('ws://127.0.0.1:3000/chat2',{query : `username=${username}&room=${room}`});
console.log(socket);

function getAllMessages() {
  // socket.emit('findAllMessages')
  socket.on('findAllMessages', (data) => {
    console.log(data);
    const messages = JSON.parse(data);
    console.log(messages);
    messages.forEach((user) => {
      addMessage(user);
    });
  });
}

function sendMessage() {
  // const username = document.querySelector('#user-username-input').value;
  const message = document.querySelector('#text-input').value;
  document.querySelector('#text-input').value = null;
  socket.emit('createMessage', { username, message });
}

function addMessage(message) {
  const messageBox = document.querySelector('.message-box');
  console.log('message to be added', message);
  const mess = document.createElement('p');
  if (message.username === username) {
    mess.className = '.message-sent';
  } else {
    mess.className = '.message-received';
  }
  mess.innerHTML = `[${message.username}] : ${message.message}`;
  messageBox.appendChild(mess);
}
socket.on('message', (payload) => addMessage(JSON.parse(payload)));
socket.on('connection', getAllMessages);
socket.on('createMessage', addMessage);

/// query selecting the button
const sendButton = document.querySelector('#send-button');
sendButton.addEventListener('click', sendMessage);
