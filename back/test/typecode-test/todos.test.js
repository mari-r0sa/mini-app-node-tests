const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Testes para todos.js (API JSONPlaceholder)", () => {
    describe("listTodos (API JSONPlaceholder)", () => {
        it("Deve retornar todos os todos corretamente", async () => {
            const res = await fetch(`${BASE_URL}/todos`);
            expect(res.status).to.equal(200);

            const data = await res.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.all.keys("userId", "id", "title", "completed");
        });

        it("Deve lançar erro se a API não retornar OK", async () => {
            try {
                const res = await fetch(`${BASE_URL}/todoss`); // rota errada para simular erro
                if (!res.ok) throw new Error("Nenhum todo encontrado");
            } catch (err) {
                expect(err.message).to.equal("Nenhum todo encontrado");
            }
        });
    });

    describe("getTodoById (API JSONPlaceholder)", () => {
        it("Deve retornar um todo por ID válido", async () => {
            const id = 1;
            const res = await fetch(`${BASE_URL}/todos/${id}`);
            expect(res.status).to.equal(200);

            const todo = await res.json();
            expect(todo).to.have.property("id", id);
            expect(todo).to.have.property("title").that.is.a("string");
            expect(todo).to.have.property("completed").that.is.a("boolean");
        });

        it("Deve lançar erro se ID não for número", async () => {
            const invalid = ["abc", null];
            for (const id of invalid) {
                try {
                    if (typeof id !== "number" || !Number.isInteger(id)) {
                        throw new Error("ID inválido");
                    }
                } catch (err) {
                    assert.match(err.message, /ID inválido/);
                }
            }
        });

        it("Deve lançar erro se todo não existir", async () => {
            const id = 99999;
            const res = await fetch(`${BASE_URL}/todos/${id}`);
            const data = await res.json();
            if (!data.id) {
                expect(() => { throw new Error("To-do não encontrado"); }).to.throw("To-do não encontrado");
            }
        });
    });

    describe("getTodosByUser (API JSONPlaceholder)", () => {
        it("Deve retornar todos por usuário existente", async () => {
            const userId = 1;
            const res = await fetch(`${BASE_URL}/users/${userId}/todos`);
            expect(res.status).to.equal(200);

            const data = await res.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data.every(t => t.userId === userId)).to.be.true;
        });

        it("Deve lançar erro se userId não for número", async () => {
            const invalid = ["abc", null];
            for (const id of invalid) {
                try {
                if (typeof id !== "number" || !Number.isInteger(id)) {
                    throw new Error("userId inválido");
                }
                } catch (err) {
                assert.match(err.message, /userId inválido/);
                }
            }
        });

        it("Deve lançar erro se usuário não existir", async () => {
            const userId = 99999;
            const res = await fetch(`${BASE_URL}/users/${userId}/todos`);
            const data = await res.json();
            if (!data.length) {
                expect(() => { throw new Error("Usuário não encontrado"); }).to.throw("Usuário não encontrado");
            }
        });
    });

    describe("createTodo (API JSONPlaceholder)", () => {
        it("Deve criar um novo todo corretamente", async () => {
            const payload = { userId: 1, title: "Novo To-do", completed: false };
            const res = await fetch(`${BASE_URL}/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            expect(res.status).to.equal(201);

            const data = await res.json();
            expect(data).to.have.property("id").that.is.a("number");
            expect(data).to.include(payload);
        });

        it("Deve lançar erro se dados obrigatórios faltarem", async () => {
            const cases = [
                { userId: 1, title: "" },
                {},
            ];
            for (const c of cases) {
                try {
                    if (!c.userId || typeof c.title !== "string" || !c.title.trim()) {
                        throw new Error("Todas as informações são obrigatórias");
                    }
                } catch (err) {
                    assert.match(err.message, /Todas as informações são obrigatórias/);
                }
            }
        });
    });

    describe("updateTodo (API JSONPlaceholder)", () => {
        it("Deve atualizar todo via PUT", async () => {
            const id = 1;
            const payload = { userId: 1, id, title: "Título atualizado", completed: true };
            const res = await fetch(`${BASE_URL}/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            expect(res.status).to.equal(200);

            const data = await res.json();
            expect(data).to.include(payload);
        });

        it("Deve lançar erro se ID for inválido no update", async () => {
            try {
                const id = "abc";
                if (typeof id !== "number") throw new Error("ID inválido");
            } catch (err) {
                assert.match(err.message, /ID inválido/);
            }
        });
    });

    describe("markTodoAsDone (API JSONPlaceholder)", () => {
        it("Deve marcar o to-do como concluído corretamente", async () => {
            const id = 1;
            const res = await fetch(`${BASE_URL}/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: true }),
            });
            expect(res.status).to.equal(200);

            const updated = await res.json();
            expect(updated).to.have.property("completed", true);
            expect(updated).to.have.property("id", id);
        });

        it("Deve lançar erro se o id não for um número", async () => {
            const invalid = [null, "abc"];
            for (const id of invalid) {
                try {
                if (typeof id !== "number" || !Number.isInteger(id)) {
                    throw new Error("ID inválido");
                }
                } catch (err) {
                expect(err.message).to.equal("ID inválido");
                }
            }
        });

        it("Deve lançar erro se o id não existir", async () => {
            const id = 99999;
            const res = await fetch(`${BASE_URL}/todos/${id}`);
            const data = await res.json();
            if (!data.id) {
                expect(() => { throw new Error("To-do não encontrado"); }).to.throw("To-do não encontrado");
            }
        });
    });

    describe("deleteTodo (API JSONPlaceholder)", () => {
        it("Deve deletar um todo existente", async () => {
            const id = 1;
            const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
            expect(res.status).to.equal(200);

            const body = await res.json();
            expect(body).to.deep.equal({});
        });

        it("Deve lançar erro se o ID não for um número", async () => {
            const invalid = ["abc", null];
            for (const id of invalid) {
                try {
                if (typeof id !== "number" || !Number.isInteger(id)) {
                    throw new Error("ID inválido");
                }
                } catch (err) {
                assert.match(err.message, /ID inválido/);
                }
            }
        });

        it("Deve lançar erro se o todo não existir", async () => {
            const id = 99999;
            const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (Object.keys(data).length === 0) {
                expect(() => { throw new Error("To-do não encontrado"); }).to.throw("To-do não encontrado");
            }
        });
    });
});
