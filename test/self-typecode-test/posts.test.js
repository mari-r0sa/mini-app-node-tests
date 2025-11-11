const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para posts (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllPosts (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todos os posts da API", async () => {
      const response = await fetch(`${BASE_URL}/posts`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.be.an("array").that.is.not.empty;
    });

    it("Deve lançar erro para endpoint incorreto", async () => {
      try {
        const response = await fetch(`${BASE_URL}/postss`);
        if (!response.ok) throw new Error("Endpoint inválido.");
      } catch (err) {
        expect(err.message).to.equal("Endpoint inválido.");
      }
    });
  });

  describe("Testes para getPostById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar post existente", async () => {
      const postId = 1;
      const response = await fetch(`${BASE_URL}/posts/${postId}`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.have.property("id", postId);
    });
  });

  describe("Testes para createPost (SELF API JSONPlaceholder)", () => {
    it("Deve criar um novo post", async () => {
      const newPost = { userId: 1, title: "Post Novo", body: "Conteúdo de teste" };
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      expect(response.status).to.be.oneOf([200, 201]);
      const data = await response.json();
      expect(data).to.include.keys("title", "userId");
    });
  });

  describe("Testes para deletePost (SELF API JSONPlaceholder)", () => {
    it("Deve deletar um post existente", async () => {
      const postId = 2;
      const response = await fetch(`${BASE_URL}/posts/${postId}`, { method: "DELETE" });
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.deep.equal({});
    });
  });
});
