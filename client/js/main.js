const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const usersNames = document.getElementById('users')
// get username and room name from url 
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username, room);
const socket = io();
// get room and users
socket.on('user-rooms-info', ({
    room,
    users
}) => {
    outputRoom(room);
    outputUsers(users);
})
// chatroom joining whth room name and username
socket.emit('joinRoom', {
    username,
    room
});
// message from server
socket.on('message', message => {
    outputMessage(message);
    //scroll every comming message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit messsge
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    // emmit message to server
    socket.emit('chatMessage', message);
    //clear input after send
    e.target.message.value = '' // focus means empty
    // focus means empty
});

// functions
// output message to client
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username}<span>  ${message.time}</span></p>
    <p class="text">
        ${message.text}.
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// output room name to client
function outputRoom(room) {
    roomName.innerText = room;
}

// output users to client
function outputUsers(users) {
    console.log({
        users
    });
    const dev = document.createElement('li');
    usersNames.innerHTML = `${users.map(user=>`<li> <span class="dot">•</span> ${user.username}</li>`).join('')}`
}