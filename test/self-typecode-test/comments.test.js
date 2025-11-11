const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para comments (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllComments (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todos os comentários da API", async () => {
      const response = await fetch(`${BASE_URL}/comments`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      data.should.be.an("array");
    });
  });

  describe("Testes para getCommentById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar comentário existente", async () => {
      const commentId = 1;
      const response = await fetch(`${BASE_URL}/comments/${commentId}`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.have.property("id", commentId);
    });
  });

  describe("Testes para createComment (SELF API JSONPlaceholder)", () => {
    it("Deve criar um novo comentário", async () => {
      const newComment = { postId: 1, name: "Teste", body: "Comentário novo" };
      const response = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });
      expect(response.status).to.be.oneOf([200, 201]);
      const data = await response.json();
      expect(data).to.include.keys("postId", "name");
    });
  });
});
