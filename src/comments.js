const comments = [
    { id: 1, postId: 1, author: "User1", text: "Primeiro comentário" },
    { id: 2, postId: 1, author: "User2", text: "Segundo comentário" },
    { id: 3, postId: 2, author: "User3", text: "Outro comentário" }
];

function getCommentsByPost(postId) {
    if (!postId || typeof postId !== "number") {
        throw new Error("postId inválido.");
    }

    if (!comments.some(comment => comment.postId === postId)) {
        throw new Error("Post não encontrado");
    }

    return comments.filter(c => c.postId === postId);
}

function getCommentById(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }

    if (!comments.some(comment => comment.id === id)) {
        throw new Error("Comentário não encontrado");
    }

    const comment = comments.find(comment => comment.id === id);

    return comment;
}

function createComment(postId, author, text) {
    if (!postId || typeof postId !== "number") {
        throw new Error("postId inválido.");
    }
    if (!author || typeof author !== "string") {
        throw new Error("author inválido.");
    }
    if (!text || typeof text !== "string") {
        throw new Error("text inválido.");
    }

    const newComment = {
        id: comments.length ? comments[comments.length - 1].id + 1 : 1,
        postId,
        author: author.trim(),
        text: text.trim()
    };

    comments.push(newComment);
    return newComment;
}

function deleteComment(id) {
    if (!id || typeof id !== "number") {
        throw new Error("id inválido.");
    }

    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
        throw new Error(`Comentário com id ${id} não encontrado.`);
    }

    comments.splice(index, 1);
    return true;
}

module.exports = { 
    comments,
    getCommentsByPost,
    getCommentById,
    createComment,
    deleteComment
};
