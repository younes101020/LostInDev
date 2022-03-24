const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Direction vers le dossier static
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const botName = 'LID Bot';

// Démarrer lorsque le client se connecte
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

            const user = userJoin(socket.id, username, room)

            socket.join(user.room);

            // Bienvenue à l'utilisateur qui viens de se connecter
            socket.emit('message', formatMessage(botName, `Bienvenue sur Lost In Dev ${user.username}, ici tu pourras rencontrer des développeurs en herbe, qui comme toi sont à la recherche d'entraide.`));

            // Broadcast lorsque l'utilisateur se connecte
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} a rejoins le groupe d'entraide`));

            // Information sur les utilisateurs & salon
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
    });

    // Ecouter les message du tchat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

        // Démarre lorsque l'utilisateur se déconnecte
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} a quittée le tchat`));

            // Information sur les utilisateurs & salon
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Le serveur démarre sur le port ${PORT}`));