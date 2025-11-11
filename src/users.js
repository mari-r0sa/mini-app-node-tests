const users = [
    { id: 1, name: "Alice", email: "alice@email.com" },
    { id: 2, name: "Maria", email: "maria@email.com" },
    { id: 3, name: "João", email: "joao@email.com" }
];

function getAllUsers() {
    if(users.length === 0) {
        throw new Error("Nenhum usuário encontrado");
    }

    return users;
}

function getUserById(id) {
    if(!id || typeof id !== 'number') {
        throw new Error("ID inválido");
    }

    if (!users.some(user => user.id === id)) {
        throw new Error("Usuário não encontrado");
    }

    return users.find(user => user.id === id);
}

function getUserByName(name) {
    if(!name || typeof name !== 'string') {
        throw new Error("Nome inválido");
    }

    if (!users.some(user => user.name.toLowerCase().includes(name.toLowerCase()))) {
        return [];
    }

    return users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
}

function getUserByEmail(email) {
    if(!email || typeof email !== 'string') {
        throw new Error("E-mail inválido");
    }

    if (!users.some(user => user.email.toLowerCase().includes(email.toLowerCase()))) {
        return [];
    }

    return users.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
}

module.exports = { users, getAllUsers, getUserById, getUserByName, getUserByEmail };
