const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para todos (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllTodos (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todas as tarefas da API", async () => {
      const response = await fetch(`${BASE_URL}/todos`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.be.an("array");
    });
  });

  describe("Testes para getTodoById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar uma tarefa específica", async () => {
      const todoId = 1;
      const response = await fetch(`${BASE_URL}/todos/${todoId}`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.have.property("id", todoId);
    });
  });

  describe("Testes para createTodo (SELF API JSONPlaceholder)", () => {
    it("Deve criar uma nova tarefa", async () => {
      const newTodo = { userId: 1, title: "Tarefa nova", completed: false };
      const response = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
      });
      expect(response.status).to.be.oneOf([200, 201]);
      const data = await response.json();
      expect(data).to.include.keys("userId", "title", "completed");
    });
  });
});
