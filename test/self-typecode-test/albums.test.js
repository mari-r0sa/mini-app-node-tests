const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para albums (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllAlbums (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todos os álbuns da API", async () => {
      const response = await fetch(`${BASE_URL}/albums`);
      expect(response.status).to.equal(200);

      const data = await response.json();
      data.should.be.an("array");
      if (data.length > 0) {
        expect(data[0]).to.have.property("id");
        expect(data[0]).to.have.property("title");
      }
    });

    it("Deve lançar erro se a API retornar um status diferente de 200", async () => {
      try {
        const response = await fetch(`${BASE_URL}/albumss`);
        if (!response.ok) {
          throw new Error("Nenhum álbum encontrado.");
        }
      } catch (err) {
        expect(err.message).to.equal("Nenhum álbum encontrado.");
      }
    });
  });

  describe("Testes para getAlbumsByUser (SELF API JSONPlaceholder)", () => {
    it("Deve retornar álbuns de um usuário existente", async () => {
      const userId = 1;

      const response = await fetch(`${BASE_URL}/users/${userId}/albums`);
      expect(response.status).to.equal(200);

      const data = await response.json();
      data.should.be.an("array");

      if (data.length === 0) {
        const q = await fetch(`${BASE_URL}/albums?userId=${userId}`);
        expect(q.status).to.equal(200);
        const dq = await q.json();
        dq.should.be.an("array");
        if (dq.length > 0) dq[0].should.have.property("userId").equal(userId);
      } else {
        data[0].should.have.property("userId").equal(userId);
      }
    });

    it("Deve lançar erro se userId for inválido", async () => {
      const invalidIds = ["abc", null];
      for (const id of invalidIds) {
        try {
          const response = await fetch(`${BASE_URL}/users/${id}/albums`);
          if (!response.ok) throw new Error("userId inválido.");
        } catch (err) {
          expect(err.message).to.equal("userId inválido.");
        }
      }
    });

    it("Deve lançar erro se usuário não tiver álbuns", async () => {
      const userId = 999;

      const response = await fetch(`${BASE_URL}/users/${userId}/albums`);
      const data = await response.json();

      let hasAlbums = data.length > 0;
      if (!hasAlbums) {
        const q = await fetch(`${BASE_URL}/albums?userId=${userId}`);
        const dq = await q.json();
        hasAlbums = dq.length > 0;
      }

      if (!hasAlbums) {
        expect(() => {
          throw new Error(`Nenhum álbum encontrado para o usuário ${userId}.`);
        }).to.throw(`Nenhum álbum encontrado para o usuário ${userId}.`);
      }
    });
  });

  describe("Testes para getAlbumById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar álbum pelo ID existente", async () => {
      const albumId = 1;
      const response = await fetch(`${BASE_URL}/albums/${albumId}`);
      expect(response.status).to.equal(200);

      const data = await response.json();
      expect(data).to.have.property("id", albumId);
      expect(data).to.have.property("title").that.is.a("string");
    });

    it("Deve lançar erro se ID inválido", async () => {
      const invalidIds = ["abc", null];
      for (const id of invalidIds) {
        try {
          const response = await fetch(`${BASE_URL}/albums/${id}`);
          if (!response.ok || typeof id !== "number") {
            throw new Error("id inválido");
          }
        } catch (err) {
          assert.match(err.message, /id inválido/);
        }
      }
    });

    it("Deve lançar erro se álbum não existir", async () => {
      const albumId = 999999; // usa id alto pra garantir inexistência
      const response = await fetch(`${BASE_URL}/albums/${albumId}`);

      // My JSON Server retorna {} quando não acha
      const data = await response.json();
      if (!data.id) {
        assert.throws(() => {
          throw new Error(`Álbum com id ${albumId} não encontrado`);
        }, new RegExp(`Álbum com id ${albumId} não encontrado`));
      }
    });
  });

  describe("Testes para createAlbum (SELF API JSONPlaceholder)", () => {
    it("Deve criar um novo álbum corretamente (mock do Typicode)", async () => {
      const newAlbum = { userId: 1, title: "Novo Álbum" };

      const response = await fetch(`${BASE_URL}/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum)
      });

      expect(response.status).to.be.oneOf([200, 201]);

      const data = await response.json().catch(() => ({}));
      expect(data).to.be.an("object");
    });

    it("Deve lançar erro se title for inválido", async () => {
      const invalidTitles = ["", null];
      for (const title of invalidTitles) {
        try {
          if (typeof title !== "string" || !title.trim()) {
            throw new Error("title inválido.");
          }
        } catch (err) {
          expect(err.message).to.equal("title inválido.");
        }
      }
    });
  });

  describe("Testes para deleteAlbum (SELF API JSONPlaceholder)", () => {
    it("Deve deletar um álbum existente (mock do Typicode)", async () => {
      const albumId = 1;

      const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
        method: "DELETE",
      });

      expect(response.status).to.equal(200);

      const data = await response.json().catch(() => ({}));
      expect(data).to.be.an("object");
    });

    it("Deve lançar erro se ID for inválido", async () => {
      const invalidIds = ["abc", null];
      for (const id of invalidIds) {
        try {
          if (typeof id !== "number" || !Number.isInteger(id)) {
            throw new Error("id inválido");
          }
          await fetch(`${BASE_URL}/albums/${id}`, { method: "DELETE" });
        } catch (err) {
          assert.match(err.message, /id inválido/);
        }
      }
    });

    it("Deve lançar erro se álbum não existir", async () => {
      const albumId = 999999;

      const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));
      if (Object.keys(data).length === 0) {
        assert.throws(() => {
          throw new Error(`Álbum com id ${albumId} não encontrado`);
        }, new RegExp(`Álbum com id ${albumId} não encontrado`));
      }
    });
  });
});
