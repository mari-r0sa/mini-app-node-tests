const todos = [
    { id: 1, task: "Criar mini app", completed: false },
    { id: 2, task: "Criar testes", completed: false }
];

function listTodos() {
    if (!todos || !Array.isArray(todos)) {
        throw new Error("Lista de todos inválida");
    }

    if (todos.length === 0) {
        throw new Error("Nenhum todo encontrado");
    }

    return todos;
}

function markTodoAsDone(id) {
    if (id === undefined || id === null || typeof id !== 'number') {
        throw new Error("ID inválido");
    }

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        throw new Error("To-do não encontrado");
    }

    if (todo.completed) {
        throw new Error("To-do já está marcado como concluído");
    }

    todo.completed = true;
    return todo;
}

module.exports = { todos, listTodos, markTodoAsDone };
