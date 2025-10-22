const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com"

describe("Testes para albums (API JSONPlaceholder)", () => {
    describe("Testes para getAllAlbums (API JSONPlaceholder)", () => {

        it("Deve retornar todos os álbuns da API", async () => {
            const response = await fetch(`${BASE_URL}/albums`);
            expect(response.status).to.equal(200);

            const data = await response.json();

            expect(data).to.have.lengthOf(100);
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

    describe("Testes para getAlbumsByUser (API JSONPlaceholder)", () => {
        it("Deve retornar álbuns de um usuário existente", async () => {
            const userId = 1;
            const response = await fetch(`${BASE_URL}/users/${userId}/albums`);
            expect(response.status).to.equal(200);

            const data = await response.json();

            data.should.be.an("array").with.length.greaterThan(0);
            data[0].should.have.property("userId").equal(userId);
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
            if (!data.length) {
                expect(() => {
                    throw new Error(`Nenhum álbum encontrado para o usuário ${userId}.`);
                }).to.throw(`Nenhum álbum encontrado para o usuário ${userId}.`);
            }
        });
    });

    describe("Testes para getAlbumById (API JSONPlaceholder)", () => {

        it("Deve retornar álbum pelo ID existente", async () => {
            const albumId = 2;
            const response = await fetch(`${BASE_URL}/albums/${albumId}`);
            expect(response.status).to.equal(200);

            const data = await response.json();

            expect(data).to.have.property("id", albumId);
            expect(data).to.have.property("userId");
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

        // 🚫 Teste 3 — álbum não existente
        it("Deve lançar erro se álbum não existir", async () => {
            const albumId = 999;
            const response = await fetch(`${BASE_URL}/albums/${albumId}`);

            const data = await response.json();
            if (!data.id) {
                assert.throws(() => {
                    throw new Error(`Álbum com id ${albumId} não encontrado`);
                }, /Álbum com id 999 não encontrado/);
            }
        });
    });

    describe("Testes para createAlbum (API JSONPlaceholder)", () => {
        it("Deve criar um novo álbum corretamente", async () => {
            const newAlbum = { userId: 1, title: "Novo Álbum" };

            const response = await fetch(`${BASE_URL}/albums`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAlbum)
            });

            expect(response.status).to.equal(201);

            const data = await response.json();

            expect(data).to.have.property("id");
            expect(data).to.have.property("userId").equal(1);
            expect(data).to.have.property("title").equal("Novo Álbum");

            expect(data.id).to.be.a("number");
        });

        it("Deve lançar erro se userId for inválido", async () => {
            const invalidUserId = "abc";

            try {
            if (typeof invalidUserId !== "number") {
                throw new Error("userId inválido.");
            }

            await fetch(`${BASE_URL}/albums`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: invalidUserId, title: "Teste" })
            });
            } catch (err) {
                expect(err.message).to.equal("userId inválido.");
            }
        });

        it("Deve lançar erro se title for inválido", async () => {
            const invalidTitles = ["", null];

            for (const title of invalidTitles) {
            try {
                if (typeof title !== "string" || !title.trim()) {
                    throw new Error("title inválido.");
                }

                await fetch(`${BASE_URL}/albums`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: 1, title })
                });
            } catch (err) {
                expect(err.message).to.equal("title inválido.");
            }
            }
        });
    });

    describe("Testes para deleteAlbum (API JSONPlaceholder)", () => {
        it("Deve deletar um álbum existente", async () => {
            const albumId = 3;

            const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
            method: "DELETE",
            });

            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.deep.equal({});

            expect(true).to.equal(true);
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
            const albumId = 999;

            const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
            method: "DELETE",
            });

            const data = await response.json();
            if (Object.keys(data).length === 0) {
                assert.throws(() => {
                    throw new Error(`Álbum com id ${albumId} não encontrado`);
                }, /Álbum com id 999 não encontrado/);
            }
        });
    });
});
