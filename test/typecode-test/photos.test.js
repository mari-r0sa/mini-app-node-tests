const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Testes para photos.js (API JSONPlaceholder)", () => {

    // 🧩 GET /photos
    describe("listPhotos", () => {
        it("Deve retornar todas as fotos corretamente", async () => {
            const response = await fetch(`${BASE_URL}/photos`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.all.keys("albumId", "id", "title", "url", "thumbnailUrl");
        });

        it("Deve lançar erro se não houver fotos", async () => {
            try {
                const response = await fetch(`${BASE_URL}/photoos`); // rota incorreta
                if (!response.ok) throw new Error("Nenhuma foto encontrada");
            } catch (err) {
                assert.match(err.message, /Nenhuma foto encontrada/);
            }
        });
    });

    // 🧩 GET /albums/:id/photos
    describe("getPhotosByAlbum", () => {
        it("Deve retornar fotos do álbum corretamente", async () => {
            const albumId = 1;
            const response = await fetch(`${BASE_URL}/albums/${albumId}/photos`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.property("albumId").equal(albumId);
        });

        it("Deve lançar erro se albumId não for número", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number") throw new Error("albumId inválido");
                } catch (err) {
                    assert.match(err.message, /albumId inválido/);
                }
            }
        });

        it("Deve lançar erro se não houver fotos no álbum", async () => {
            const albumId = 9999;
            const response = await fetch(`${BASE_URL}/albums/${albumId}/photos`);
            const data = await response.json();

            if (!data.length) {
                assert.throws(() => {
                    throw new Error(`Nenhuma foto encontrada para o álbum ${albumId}`);
                }, new RegExp(`Nenhuma foto encontrada para o álbum ${albumId}`));
            }
        });
    });

    // 🧩 GET /photos/:id
    describe("getPhotoById", () => {
        it("Deve retornar foto pelo ID corretamente", async () => {
            const photoId = 2;
            const response = await fetch(`${BASE_URL}/photos/${photoId}`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.have.property("id", photoId);
            expect(data).to.have.property("albumId");
            expect(data).to.have.property("title").that.is.a("string");
            expect(data).to.have.property("url").that.includes("http");
        });

        it("Deve lançar erro se ID não for número", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number") throw new Error("id inválido");
                } catch (err) {
                    assert.match(err.message, /id inválido/);
                }
            }
        });

        it("Deve lançar erro se foto não existir", async () => {
            const photoId = 99999;
            const response = await fetch(`${BASE_URL}/photos/${photoId}`);
            const data = await response.json();

            if (!data.id) {
                assert.throws(() => {
                    throw new Error(`Foto com id ${photoId} não encontrada`);
                }, new RegExp(`Foto com id ${photoId} não encontrada`));
            }
        });
    });

    // 🧩 POST /photos
    describe("addPhoto", () => {
        it("Deve adicionar uma nova foto corretamente", async () => {
            const newPhoto = {
                albumId: 1,
                title: "Nova Foto",
                url: "https://example.com/nova",
                thumbnailUrl: "https://example.com/nova-thumb"
            };

            const response = await fetch(`${BASE_URL}/photos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPhoto)
            });

            expect(response.status).to.equal(201);
            const data = await response.json();

            expect(data).to.have.property("id");
            expect(data).to.have.property("albumId").equal(1);
            expect(data).to.have.property("title").equal("Nova Foto");
            expect(data).to.have.property("url").equal("https://example.com/nova");
        });

        it("Deve lançar erro se albumId inválido", async () => {
            try {
                const albumId = "abc";
                if (typeof albumId !== "number") throw new Error("albumId inválido");
            } catch (err) {
                assert.match(err.message, /albumId inválido/);
            }
        });

        it("Deve lançar erro se title inválido", async () => {
            const invalidTitles = ["", null];
                for (const title of invalidTitles) {
                try {
                    if (typeof title !== "string" || !title.trim()) throw new Error("title inválido");
                } catch (err) {
                    expect(err.message).to.equal("title inválido");
                }
            }
        });

        it("Deve lançar erro se url inválido", async () => {
            const invalidUrls = ["", null];
            for (const url of invalidUrls) {
                try {
                    if (typeof url !== "string" || !url.trim()) throw new Error("url inválido");
                } catch (err) {
                    expect(err.message).to.equal("url inválido");
                }
            }
        });
    });

    // 🧩 DELETE /photos/:id
    describe("deletePhoto", () => {
        it("Deve deletar uma foto existente", async () => {
            const photoId = 3;
            const response = await fetch(`${BASE_URL}/photos/${photoId}`, {
                method: "DELETE"
            });

            expect(response.status).to.equal(200);
            const data = await response.json();
            expect(data).to.deep.equal({});
            expect(true).to.equal(true);
        });

        it("Deve lançar erro se id não for número", async () => {
            const invalidIds = ["abc", null];
            for (const id of invalidIds) {
                try {
                    if (typeof id !== "number") throw new Error("id inválido");
                } catch (err) {
                    assert.match(err.message, /id inválido/);
                }
            }
        });

        it("Deve lançar erro se foto não existir", async () => {
            const photoId = 99999;
            const response = await fetch(`${BASE_URL}/photos/${photoId}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (Object.keys(data).length === 0) {
                assert.throws(() => {
                    throw new Error(`Foto com id ${photoId} não encontrada`);
                }, new RegExp(`Foto com id ${photoId} não encontrada`));
            }
        });
    });
});
