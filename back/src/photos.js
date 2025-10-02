const photos = [
    { id: 1, albumId: 1, title: "Foto 1", url: "https://example.com/1" },
    { id: 2, albumId: 1, title: "Foto 2", url: "https://example.com/2" },
    { id: 3, albumId: 2, title: "Foto 3", url: "https://example.com/3" }
];

function listPhotos() {
    if (photos.length === 0) {
        throw new Error("Nenhuma foto encontrada.");
    }
    return photos;
}

function getPhotosByAlbum(albumId) {
    if (!albumId || typeof albumId !== "number") {
        throw new Error("albumId inválido.");
    }
    const result = photos.filter(p => p.albumId === albumId);
    if (result.length === 0) {
        throw new Error(`Nenhuma foto encontrada para o álbum ${albumId}.`);
    }
    return result;
}

function getPhotoById(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }
    const photo = photos.find(p => p.id === id);
    if (!photo) {
        throw new Error(`Foto com id ${id} não encontrada.`);
    }
    return photo;
}

// Adiciona uma nova foto
function addPhoto(albumId, title, url) {
    if (!albumId || typeof albumId !== "number") {
        throw new Error("albumId inválido.");
    }
    if (!title || typeof title !== "string") {
        throw new Error("title inválido.");
    }
    if (!url || typeof url !== "string") {
        throw new Error("url inválido.");
    }

    const newPhoto = {
        id: photos.length ? photos[photos.length - 1].id + 1 : 1,
        albumId,
        title: title.trim(),
        url: url.trim()
    };

    photos.push(newPhoto);
    return newPhoto;
}

function deletePhoto(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }
    const index = photos.findIndex(p => p.id === id);
    if (index === -1) {
        throw new Error(`Foto com id ${id} não encontrada.`);
    }
    photos.splice(index, 1);
    return true;
}

module.exports = {
    photos,
    listPhotos,
    getPhotosByAlbum,
    getPhotoById,
    addPhoto,
    deletePhoto
};
