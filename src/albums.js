const albums = [
    { id: 1, userId: 1, title: "Álbum Alice" },
    { id: 2, userId: 2, title: "Álbum Bob" },
    { id: 3, userId: 3, title: "Álbum Carol" }
];

function getAllAlbums() {
    if (albums.length === 0) {
        throw new Error("Nenhum álbum encontrado.");
    }
    return albums;
}

function getAlbumsByUser(userId) {
    if (!userId || typeof userId !== "number") {
        throw new Error("userId inválido.");
    }

    const result = albums.filter(a => a.userId === userId);
    if (result.length === 0) {
        throw new Error(`Nenhum álbum encontrado para o usuário ${userId}.`);
    }

    return result;
}

function getAlbumById(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }

    const album = albums.find(a => a.id === id);
    if (!album) {
        throw new Error(`Álbum com id ${id} não encontrado.`);
    }

    return album;
}

function getAlbumsByTitle(title) {
    if (!title || typeof title !== "string") {
        throw new Error("Título inválido.");
    }

    const result = albums.filter(a => a.title.toLowerCase().includes(title.toLowerCase()));
    if (result.length === 0) {
        throw new Error(`Nenhum álbum encontrado com o título "${title}".`);
    }

    return result;
}

function createAlbum(userId, title) {
    if (!userId || typeof userId !== "number") {
        throw new Error("userId inválido.");
    }
    if (!title || typeof title !== "string") {
        throw new Error("title inválido.");
    }

    const newAlbum = {
        id: albums.length ? albums[albums.length - 1].id + 1 : 1,
        userId,
        title: title.trim()
    };

    albums.push(newAlbum);
    return newAlbum;
}

function deleteAlbum(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }

    const index = albums.findIndex(a => a.id === id);
    if (index === -1) {
        throw new Error(`Álbum com id ${id} não encontrado.`);
    }

    albums.splice(index, 1);
    return true;
}

module.exports = {
    albums,
    getAllAlbums,
    getAlbumsByUser,
    getAlbumById,
    getAlbumsByTitle,
    createAlbum,
    deleteAlbum
};