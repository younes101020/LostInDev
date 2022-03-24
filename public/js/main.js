const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Récuperation des utilisateurs et salons à partir de l'URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();


// Cloisonement du salon
socket.emit('joinRoom', { username, room });

// Récuperer les salons & utilisateurs
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message provenant du serveur qui permet la multidifusion
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll based
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message envoyer
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récuperer le message dans le DOM
    const msg = e.target.elements.msg.value;

    // Emettre le message au serveur
    socket.emit('chatMessage', msg)

    // Effacer l'input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Message sortie du document
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Ajouts des noms des salons au DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Ajouts des noms d'utilisateurs au document
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}