const { todos, listTodos, markTodoAsDone } = require("../src/todos");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para todos.js", () => {
    beforeEach(() => {
        // Resetando a lista de todos antes de cada teste
        todos.length = 0;
        todos.push(
            { id: 1, task: "Comprar leite", done: false },
            { id: 2, task: "Estudar Node.js", done: false },
            { id: 3, task: "Fazer exercícios", done: true }
        );
    });

    describe("Testes para markTodoAsDone", () => {
        // expect().to.throw
        it("Deve lançar erro se o id não for um número", () => {
            expect(() => markTodoAsDone(null)).to.throw("ID inválido");
            expect(() => markTodoAsDone("abc")).to.throw("ID inválido");
        });

        // expect().to.throw
        it("Deve lançar erro se o id não existir no array", () => {
            expect(() => markTodoAsDone(999)).to.throw("To-do não encontrado");
        });

        // expect().to.be.true
        // should.be.true
        it("Deve marcar o to-do como concluído corretamente", () => {
            const updatedTodo = markTodoAsDone(1);

            expect(updatedTodo.completed).to.be.true;

            const todoInArray = todos.find(t => t.id === 1);
            todoInArray.completed.should.be.true;
        });
    });

    describe("Testes para listTodos", () => {
        // assert.deepStrictEqual
        it("Deve retornar todos os todos corretamente", () => {
            const result = listTodos();
            assert.deepStrictEqual(result, todos);
        });
        
        // expect().to.throw
        it("Deve lançar erro se não houver nenhum todo", () => {
            todos.length = 0;
            expect(() => listTodos()).to.throw("Nenhum todo encontrado");
        });
    });
});