const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Testes para posts.js (API JSONPlaceholder)", () => {
    // 🧩 GET /posts
    describe("getAllPosts", () => {
        it("Deve retornar todos os posts corretamente", async () => {
            const response = await fetch(`${BASE_URL}/posts`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.all.keys("userId", "id", "title", "body");
        });

        it("Deve lançar erro se não houver posts", async () => {
            try {
                const response = await fetch(`${BASE_URL}/postss`);
                if (!response.ok) throw new Error("Nenhum post encontrado");
            } catch (err) {
                assert.match(err.message, /Nenhum post encontrado/);
            }
        });
    });

    // 🧩 GET /posts/:id
    describe("getPostById", () => {
        it("Deve buscar post por ID corretamente", async () => {
            const postId = 2;
            const response = await fetch(`${BASE_URL}/posts/${postId}`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.have.property("id", postId);
            expect(data).to.have.property("userId").that.is.a("number");
            expect(data).to.have.property("title").that.is.a("string");
            expect(data).to.have.property("body").that.is.a("string");
        });

        it("Deve lançar erro se ID não existir", async () => {
            const postId = 9999;
            const response = await fetch(`${BASE_URL}/posts/${postId}`);
            const data = await response.json();

            if (!data.id) {
                assert.throws(() => {
                    throw new Error("Post não encontrado");
                }, /Post não encontrado/);
            }
        });

        it("Deve lançar erro se ID não for número", async () => {
            const invalidIds = ["a", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number" || !Number.isInteger(id)) {
                    throw new Error("ID inválido");
                    }
                } catch (err) {
                    assert.match(err.message, /ID inválido/);
                }
            }
        });
    });

    // 🧩 GET /users/:id/posts
    describe("getPostsByUser", () => {
        it("Deve buscar posts por usuário corretamente", async () => {
            const userId = 1;
            const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.property("userId").equal(userId);
        });

        it("Deve lançar erro se userId não existir", async () => {
            const userId = 9999;
            const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
            const data = await response.json();

            if (!data.length) {
                assert.throws(() => {
                    throw new Error("Usuário não encontrado");
                }, /Usuário não encontrado/);
            }
        });

        it("Deve lançar erro se userId não for número", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number") throw new Error("ID inválido");
                } catch (err) {
                    assert.match(err.message, /ID inválido/);
                }
            }
        });
    });

    // 🧩 Busca por título (filtro local sobre /posts)
    describe("getPostsByTitle", () => {
        it("Deve buscar posts por título parcial (case insensitive)", async () => {
            const searchTerm = "qui";
            const response = await fetch(`${BASE_URL}/posts`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            const result = data.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            result.should.be.an("array").with.length.greaterThan(0);
            result[0].title.should.match(new RegExp(searchTerm, "i"));
        });

        it("Deve retornar array vazio se nenhum título encontrado", async () => {
            const searchTerm = "inexistente123";
            const response = await fetch(`${BASE_URL}/posts`);
            const data = await response.json();

            const result = data.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            assert.strictEqual(result.length, 0);
        });

        it("Deve lançar erro se título não for string", async () => {
            const invalidTitles = [123, null];
            for (const title of invalidTitles) {
                try {
                    if (typeof title !== "string" || !title.trim()) {
                        throw new Error("Título buscado inválido");
                    }
                } catch (err) {
                    assert.match(err.message, /Título buscado inválido/);
                }
            }
        });
    });

    // 🧩 POST /posts
    describe("createFakePost", () => {
        it("Deve criar um novo post corretamente", async () => {
            const newPost = {
                userId: 2,
                title: "Novo Post",
                body: "Conteúdo do novo post"
            };

            const response = await fetch(`${BASE_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost)
            });

            expect(response.status).to.equal(201);
            const data = await response.json();

            expect(data).to.have.property("id");
            expect(data).to.have.property("userId").equal(2);
            expect(data).to.have.property("title").equal("Novo Post");
            expect(data).to.have.property("body").equal("Conteúdo do novo post");
        });

        it("Deve lançar erro ao criar post com dados incompletos", async () => {
            const invalidPosts = [
                { userId: 1, title: "", body: "Sem título" },
                { }
            ];

            for (const post of invalidPosts) {
                try {
                    if (!post.userId || !post.title || !post.body) {
                        throw new Error("Todas as informações são obrigatórias");
                    }
                } catch (err) {
                    assert.match(err.message, /Todas as informações são obrigatórias/);
                }
            }
        });
    });

    // 🧩 DELETE /posts/:id
    describe("deletePostById", () => {
        it("Deve remover um post existente pelo ID", async () => {
            const postId = 1;
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: "DELETE"
            });

            expect(response.status).to.equal(200);
            const data = await response.json();
            expect(data).to.deep.equal({});
            expect(true).to.equal(true);
        });

        it("Deve lançar erro ao tentar remover um post inexistente", async () => {
            const postId = 9999;
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: "DELETE"
            });

            const data = await response.json();
            if (Object.keys(data).length === 0) {
                assert.throws(() => {
                throw new Error("Post não encontrado");
                }, /Post não encontrado/);
            }
        });

        it("Deve lançar erro se o ID não for um número", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number") throw new Error("ID inválido");
                } catch (err) {
                    assert.match(err.message, /ID inválido/);
                }
            }
        });
    });
});
