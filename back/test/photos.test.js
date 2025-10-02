const { photos, listPhotos, getPhotosByAlbum, getPhotoById, addPhoto, deletePhoto } = require("../src/photos");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para photos.js", () => {
    beforeEach(() => {
        photos.length = 0;
        photos.push(
            { id: 1, albumId: 1, title: "Foto 1", url: "https://example.com/1" },
            { id: 2, albumId: 1, title: "Foto 2", url: "https://example.com/2" },
            { id: 3, albumId: 2, title: "Foto 3", url: "https://example.com/3" }
        );
    });

    describe("Testes para listPhotos", () => {
        // assert.deepEqual
        it("Deve retornar todas as fotos corretamente", () => {
            const result = listPhotos();
            assert.deepEqual(result, photos);
        });

        // assert.throws
        it("Deve lançar erro se não houver fotos", () => {
            photos.length = 0;
            assert.throws(() => listPhotos(), /Nenhuma foto encontrada/);
        });
    });

    describe("Testes para getPhotosByAlbum", () => {
        // expect().to.have.lengthOf
        it("Deve retornar fotos do álbum corretamente", () => {
            const result = getPhotosByAlbum(1);
            expect(result).to.have.lengthOf(2);
            result[0].should.have.property("albumId").equal(1);
        });

        // assert.throws
        it("Deve lançar erro se albumId não for número", () => {
            assert.throws(() => getPhotosByAlbum("abc"), /albumId inválido/);
        });

        // assert.throws
        it("Deve lançar erro se não houver fotos no álbum", () => {
            assert.throws(() => getPhotosByAlbum(999), /Nenhuma foto encontrada para o álbum 999/);
        });
    });

    describe("Testes para getPhotoById", () => {
        // expect().to.have
        it("Deve retornar foto pelo ID corretamente", () => {
            const photo = getPhotoById(2);
            expect(photo).to.have.property("title").equal("Foto 2");
            assert.strictEqual(photo.albumId, 1);
        });

       // assert.throws 
        it("Deve lançar erro se ID não for número", () => {
            assert.throws(() => getPhotoById("abc"), /id inválido/);
        });

        // assert.throws
        it("Deve lançar erro se foto não existir", () => {
            assert.throws(() => getPhotoById(999), /Foto com id 999 não encontrada/);
        });
    });

    describe("Testes para addPhoto", () => {
        // expect().to.have.property().equal
        // expect().to.equal
        it("Deve adicionar uma nova foto corretamente", () => {
            const newPhoto = addPhoto(2, "Nova Foto", "https://example.com/nova");
            expect(newPhoto).to.have.property("id").equal(4);
            expect(newPhoto).to.have.property("albumId").equal(2);
            expect(newPhoto).to.have.property("title").equal("Nova Foto");
            expect(newPhoto).to.have.property("url").equal("https://example.com/nova");
            expect(photos.length).to.equal(4);
        });

        // assert.throws()
        it("Deve lançar erro se albumId inválido", () => {
            assert.throws(() => addPhoto("abc", "Foto", "url"), /albumId inválido/);
        });

        // assert.throws()
        it("Deve lançar erro se title inválido", () => {
            assert.throws(() => addPhoto(1, "", "url"), /title inválido/);
        });

        // assert.throws()
        it("Deve lançar erro se url inválido", () => {
            assert.throws(() => addPhoto(1, "Foto", ""), /url inválido/);
        });
    });

    describe("Testes para deletePhoto", () => {
        // expect().to.be.true
        // expect().to.be.false
        // expect().to.equal
        it("Deve deletar uma foto existente", () => {
            const originalLength = photos.length;
            const idToDelete = 2;

            const result = deletePhoto(idToDelete);
            expect(result).to.be.true;
            expect(photos.some(p => p.id === idToDelete)).to.be.false;
            expect(photos.length).to.equal(originalLength - 1);
        });

        // assert.throws()
        it("Deve lançar erro se id não for número", () => {
            assert.throws(() => deletePhoto("abc"), /id inválido/);
        });
        
        // assert.throws()
        it("Deve lançar erro se foto não existir", () => {
            assert.throws(() => deletePhoto(999), /Foto com id 999 não encontrada/);
        });
    });
});