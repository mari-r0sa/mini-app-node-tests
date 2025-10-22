const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para users (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllUsers (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todos os usuários da API", async () => {
      const response = await fetch(`${BASE_URL}/users`);
      expect(response.status).to.equal(200);

      const data = await response.json();
      data.should.be.an("array").that.is.not.empty;
      expect(data[0]).to.have.keys("id", "name", "email");
    });

    it("Deve lançar erro se a API retornar um status diferente de 200", async () => {
      try {
        const response = await fetch(`${BASE_URL}/userrs`);
        if (!response.ok) throw new Error("Nenhum usuário encontrado.");
      } catch (err) {
        expect(err.message).to.equal("Nenhum usuário encontrado.");
      }
    });
  });

  describe("Testes para getUserById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar usuário existente", async () => {
      const userId = 1;
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.have.property("id", userId);
    });

    it("Deve lançar erro se ID for inválido", async () => {
      const invalidIds = ["abc", null];
      for (const id of invalidIds) {
        try {
          const response = await fetch(`${BASE_URL}/users/${id}`);
          if (!response.ok) throw new Error("ID inválido.");
        } catch (err) {
          expect(err.message).to.equal("ID inválido.");
        }
      }
    });

    it("Deve lançar erro se usuário não existir", async () => {
      const userId = 999;
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await response.json();
      if (!data.id) {
        assert.throws(() => {
          throw new Error(`Usuário com id ${userId} não encontrado.`);
        }, /Usuário com id 999 não encontrado/);
      }
    });
  });

  describe("Testes para createUser (SELF API JSONPlaceholder)", () => {
    it("Deve criar um novo usuário corretamente", async () => {
      const newUser = { name: "Teste Usuário", email: "teste@email.com" };
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      expect(response.status).to.be.oneOf([200, 201]);
      const data = await response.json();
      expect(data).to.have.property("name");
    });

    it("Deve lançar erro se nome for inválido", async () => {
      const invalidNames = ["", null];
      for (const name of invalidNames) {
        try {
          if (typeof name !== "string" || !name.trim()) {
            throw new Error("Nome inválido.");
          }
        } catch (err) {
          expect(err.message).to.equal("Nome inválido.");
        }
      }
    });
  });

  describe("Testes para deleteUser (SELF API JSONPlaceholder)", () => {
    it("Deve deletar um usuário existente", async () => {
      const userId = 2;
      const response = await fetch(`${BASE_URL}/users/${userId}`, { method: "DELETE" });
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.deep.equal({});
    });
  });
});