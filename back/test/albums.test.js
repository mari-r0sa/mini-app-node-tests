const { albums, getAllAlbums, getAlbumsByUser, getAlbumById, getAlbumsByTitle, createAlbum, deleteAlbum } = require("../src/albums");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para albums.js", () => {
    beforeEach(() => {
        albums.length = 0;
        albums.push(
            { id: 1, userId: 1, title: "Álbum Alice" },
            { id: 2, userId: 2, title: "Álbum Bob" },
            { id: 3, userId: 3, title: "Álbum Carol" }
        );
    });

    describe("Testes para getAllAlbums", () => {
        // expect().to.deep.equal
        it("Deve retornar todos os álbuns", () => {
            const result = getAllAlbums();
            expect(result).to.deep.equal(albums);
        });

        // expect.to.throw
        it("Deve lançar erro se não houver álbuns", () => {
            albums.length = 0;
            expect(() => getAllAlbums()).to.throw("Nenhum álbum encontrado.");
        });
    });

    describe("Testes para getAlbumsByUser", () => {
        // should.be.an().with.lengthOf
        // should.have.property().equal
        it("Deve retornar álbuns de um usuário existente", () => {
            const result = getAlbumsByUser(1);
            result.should.be.an("array").with.lengthOf(1);
            result[0].should.have.property("userId").equal(1);
        });

        // expect().to.throw
        it("Deve lançar erro se userId inválido", () => {
            expect(() => getAlbumsByUser("abc")).to.throw("userId inválido.");
            expect(() => getAlbumsByUser(null)).to.throw("userId inválido.");
        });

        // expect().to.throw
        it("Deve lançar erro se usuário não tiver álbuns", () => {
            expect(() => getAlbumsByUser(999)).to.throw("Nenhum álbum encontrado para o usuário 999.");
        });
    });

    describe("Testes para getAlbumById", () => {
        // expect().to.deep.equal
        it("Deve retornar álbum pelo ID existente", () => {
            const result = getAlbumById(2);
            expect(result).to.deep.equal({ id: 2, userId: 2, title: "Álbum Bob" });
        });

        // assert.throws
        it("Deve lançar erro se ID inválido", () => {
            assert.throws(() => getAlbumById("abc"), /id inválido/);
            assert.throws(() => getAlbumById(null), /id inválido/);
        });

        // assert.throws
        it("Deve lançar erro se álbum não existir", () => {
            assert.throws(() => getAlbumById(999), /Álbum com id 999 não encontrado/);
        });
    });

    describe("Testes para getAlbumsByTitle", () => {
        // expect().to.have.lengthOf
        // should.match + regex
        it("Deve buscar álbuns por título parcial (case insensitive)", () => {
            const result = getAlbumsByTitle("álbum");
            expect(result).to.have.lengthOf(3);
            result[0].title.should.match(/Álbum/);
        });

        // expect().to.throw
        it("Deve lançar erro se título inválido", () => {
            expect(() => getAlbumsByTitle(123)).to.throw("Título inválido.");
            expect(() => getAlbumsByTitle("")).to.throw("Título inválido.");
        });

        // expect().to.throw
        it("Deve lançar erro se nenhum álbum corresponder ao título", () => {
            expect(() => getAlbumsByTitle("inexistente")).to.throw('Nenhum álbum encontrado com o título "inexistente".');
        });
    });

    describe("Testes para createAlbum", () => {
        // expect().to.have.property().equal
        // expect().to.include
        it("Deve criar um novo álbum corretamente", () => {
            const result = createAlbum(1, "Novo Álbum");
            expect(result).to.have.property("id").equal(4);
            expect(result).to.have.property("userId").equal(1);
            expect(result).to.have.property("title").equal("Novo Álbum");
            expect(albums).to.include(result);
        });

        // expect().to.throw
        it("Deve lançar erro se userId inválido", () => {
            expect(() => createAlbum("abc", "Teste")).to.throw("userId inválido.");
        });

        // expect().to.throw
        it("Deve lançar erro se title inválido", () => {
            expect(() => createAlbum(1, "")).to.throw("title inválido.");
            expect(() => createAlbum(1, null)).to.throw("title inválido.");
        });
    });

    describe("Testes para deleteAlbum", () => {
        // expect().to.equal
        // expect().to.be.false
        it("Deve deletar um álbum existente", () => {
            const originalLength = albums.length;
            const result = deleteAlbum(3);
            expect(result).to.equal(true);
            expect(albums.length).to.equal(originalLength - 1);
            expect(albums.some(a => a.id === 3)).to.be.false;
        });

        // assert.throws
        it("Deve lançar erro se ID inválido", () => {
            assert.throws(() => deleteAlbum("abc"), /id inválido/);
            assert.throws(() => deleteAlbum(null), /id inválido/);
        });

        // assert.throws
        it("Deve lançar erro se álbum não existir", () => {
            assert.throws(() => deleteAlbum(999), /Álbum com id 999 não encontrado/);
        });
    });
});
