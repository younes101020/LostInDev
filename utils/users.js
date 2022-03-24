const users = [];

// Un utilisateur rejoin le tchat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Utilisateur Actuelle
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Un utilisateur quitte le chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Récuperer le salon du l'utilisateur
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}