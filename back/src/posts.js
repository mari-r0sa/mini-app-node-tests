const posts = [
    { id: 1, userId: 1, title: "Post 1", body: "Conteúdo do post 1" },
    { id: 2, userId: 2, title: "Post 2", body: "Conteúdo do post 2" },
    { id: 3, userId: 1, title: "Post 3", body: "Conteúdo do post 3" }
];

function getAllPosts() {
    if(posts.length === 0) {
        throw new Error("Nenhum post encontrado");
    }

    return posts;
}

function getPostsByUser(userId) {
    if(!userId || typeof userId !== 'number') {
        throw new Error("ID inválido");
    }

    if (!posts.some(post => post.userId === userId)) {
        throw new Error("Usuário não encontrado");
    }

    return posts.filter(post => post.userId === userId);
}

function getPostById(id) {
    if(!id || typeof id !== 'number') {
        throw new Error("ID inválido");
    }

    if (!posts.some(post => post.id === id)) {
        throw new Error("Post não encontrado");
    }

    return posts.find(post => post.id === id) || null;
}

function getPostsByTitle(str) {
    if(!str || typeof str !== 'string') {
        throw new Error("Título buscado inválido");
    }

    // Se não encontrar, retorna vazio
    if (!str) return [];

    // Busca case insensitive
    const p = String(str).toLowerCase();
    return posts.filter(post => post.title.toLowerCase().includes(p));
}

function createFakePost(userId, title, body) {
    if(!userId || !title || !body) {
        throw new Error("Todas as informações são obrigatórias: ID do usuário (userId), título (title) e corpo do post (body)");
    }

    const post = { id: posts.length + 1, userId, title, body };
    posts.push(post);
}

function deletePostById(id) {
    if (!id || typeof id !== "number") {
        throw new Error("ID inválido");
    }

    const index = posts.findIndex(post => post.id === id);

    if (index === -1) {
        throw new Error("Post não encontrado");
    }

    posts.splice(index, 1);
}

module.exports = { posts, getAllPosts, createFakePost, getPostsByUser, getPostById, getPostsByTitle, deletePostById };
