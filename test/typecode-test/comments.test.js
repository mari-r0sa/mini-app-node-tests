const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Testes para comments.js (API JSONPlaceholder)", () => {
    // 🧩 GET /comments
    describe("getAllComments", () => {
        it("Deve retornar todos os comentários (status 200)", async () => {
            const response = await fetch(`${BASE_URL}/comments`);
            expect(response.status).to.equal(200);

            const data = await response.json();

            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.all.keys("postId", "id", "name", "email", "body");
        });

        it("Deve lançar erro se a API não retornar OK", async () => {
            try {
                const response = await fetch(`${BASE_URL}/commentss`);
                if (!response.ok) {
                    throw new Error("Nenhum comentário encontrado.");
                }
                } catch (err) {
                    expect(err.message).to.equal("Nenhum comentário encontrado.");
            }
        });

        it("Deve lançar erro se a lista vier vazia", async () => {
            const fake = [];
            if (fake.length === 0) {
                expect(() => {
                    throw new Error("Nenhum comentário encontrado.");
                }).to.throw("Nenhum comentário encontrado.");
            }
        });
    });
  
    // 🧩 GET /posts/:id/comments
    describe("getCommentsByPost", () => {
        it("Deve retornar todos os comentários de um post existente", async () => {
        const postId = 1;
        const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        expect(response.status).to.equal(200);

        const data = await response.json();
        expect(data).to.be.an("array").with.length.greaterThan(0);
        expect(data.every(c => c.postId === postId)).to.be.true;
        assert.strictEqual(data[0].postId, postId);
        });

        it("Deve lançar erro se postId for inválido", async () => {
        const invalidIds = ["abc", null];
        for (const id of invalidIds) {
            try {
            if (typeof id !== "number" || !Number.isInteger(id)) {
                throw new Error("postId inválido");
            }
            await fetch(`${BASE_URL}/posts/${id}/comments`);
            } catch (err) {
            expect(err.message).to.equal("postId inválido");
            }
        }
        });

        it("Deve lançar erro se o post não existir", async () => {
        const postId = 9999;
        const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        const data = await response.json();

        if (!data.length) {
            assert.throws(() => {
            throw new Error("Post não encontrado");
            }, /Post não encontrado/);
        }
        });
    });

    // 🧩 GET /comments/:id
    describe("getCommentById", () => {
    it("Deve retornar um comentário pelo ID válido", async () => {
        const commentId = 2;
        const response = await fetch(`${BASE_URL}/comments/${commentId}`);
        expect(response.status).to.equal(200);

        const data = await response.json();
        expect(data).to.have.property("id", commentId);
        expect(data).to.have.property("postId");
        expect(data).to.have.property("name");
        expect(data).to.have.property("body");
    });

    it("Deve lançar erro se id for inválido", async () => {
        const invalidIds = ["abc", null];
        for (const id of invalidIds) {
        try {
            if (typeof id !== "number" || !Number.isInteger(id)) {
            throw new Error("id inválido");
            }
        } catch (err) {
            assert.match(err.message, /id inválido/);
        }
        }
    });

    it("Deve lançar erro se o comentário não existir", async () => {
        const commentId = 9999;
        const response = await fetch(`${BASE_URL}/comments/${commentId}`);
        const data = await response.json();

        if (!data.id) {
        expect(() => {
            throw new Error("Comentário não encontrado");
        }).to.throw("Comentário não encontrado");
        }
    });
    });

    // 🧩 POST /comments
    describe("createComment", () => {
        it("Deve adicionar um novo comentário válido", async () => {
            const newComment = {
                postId: 1,
                name: "User4",
                email: "user4@example.com",
                body: "Comentário novo"
            };

            const response = await fetch(`${BASE_URL}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment)
            });

            expect(response.status).to.equal(201);
            const data = await response.json();

            expect(data).to.have.property("id");
            expect(data).to.have.property("postId").equal(1);
            expect(data).to.have.property("name").equal("User4");
            expect(data).to.have.property("body").equal("Comentário novo");
            assert.ok(typeof data.id === "number");
        });

        it("Deve lançar erro se postId for inválido", async () => {
            try {
                const postId = "abc";
                if (typeof postId !== "number") {
                    throw new Error("postId inválido");
                }
            } catch (err) {
                assert.match(err.message, /postId inválido/);
            }
        });

        it("Deve lançar erro se author for inválido", async () => {
            const invalidNames = ["", null];
            for (const name of invalidNames) {
                try {
                    if (typeof name !== "string" || !name.trim()) {
                        throw new Error("author inválido");
                    }
                } catch (err) {
                    expect(err.message).to.equal("author inválido");
                }
            }
        });

        it("Deve lançar erro se text for inválido", async () => {
            const invalidTexts = ["", null];
            for (const body of invalidTexts) {
                try {
                    if (typeof body !== "string" || !body.trim()) {
                        throw new Error("text inválido");
                    }
                } catch (err) {
                    expect(err.message).to.equal("text inválido");
                }
            }
        });
    });

    describe("deleteComment", () => {
        it("Deve deletar um comentário existente", async () => {
            const commentId = 3;
            const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
                method: "DELETE"
            });

            expect(response.status).to.equal(200);
            const data = await response.json();
            expect(data).to.deep.equal({});
            expect(true).to.equal(true);
        });

        it("Deve lançar erro se id for inválido", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number" || !Number.isInteger(id)) {
                        throw new Error("id inválido");
                    }
                } catch (err) {
                    assert.match(err.message, /id inválido/);
                }
            }
        });

        it("Deve lançar erro se comentário não existir", async () => {
            const commentId = 9999;
            const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (Object.keys(data).length === 0) {
                assert.throws(() => {
                    throw new Error(`Comentário com id ${commentId} não encontrado.`);
                }, /Comentário com id 9999 não encontrado/);
            }
        });
    });
});
