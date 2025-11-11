const { posts, getAllPosts, createFakePost, getPostsByUser, getPostById, getPostsByTitle, deletePostById } = require("../src/posts");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para posts.js", () => {
    beforeEach(() => {
        posts.length = 0;
        posts.push(
            { id: 1, userId: 1, title: "Post 1", body: "Conteúdo do post 1" },
            { id: 2, userId: 2, title: "Post 2", body: "Conteúdo do post 2" },
            { id: 3, userId: 1, title: "Post 3", body: "Conteúdo do post 3" }
        );
    });

    describe("Testes para getAllPosts", () => {
        // assert.deepEqual
        it("Deve retornar todos os posts corretamente", () => {
            const result = getAllPosts();
            assert.deepEqual(result, posts);
        });

        // assert.throws + assert.doesNotThrow
        it("Deve lançar erro se não houver posts", () => {
            posts.length = 0; // zera a lista
            assert.throws(() => getAllPosts(), /Nenhum post encontrado/);
        });
    });

    describe("Testes para getPostById", () => {  
        // expect().to.have.property().equal
        // assert.strictEqual
        it("Deve buscar post por ID corretamente", () => {
            const post = getPostById(2);
            expect(post).to.have.property("title").equal("Post 2");
            assert.strictEqual(post.userId, 2);
        });

        // assert.throws
        it("Deve lançar erro se ID não existir", () => {
            assert.throws(() => getPostById(99), /Post não encontrado/);
        });

        // assert.throws
        it("Deve lançar erro se ID não for número", () => {
            assert.throws(() => getPostById("a"), /ID inválido/);
        });
    });

    describe("Testes para getPostsByUser", () => {
        // assert.doesNotThrow
        // expect().to.have.lengthOf
        // should.have.property().equal
        it("Deve buscar posts por usuário corretamente", () => {
            const result = getPostsByUser(1);

            assert.doesNotThrow(() => getPostsByUser(1));
            expect(result).to.have.lengthOf(2);
            result[0].should.have.property("userId").equal(1);
        });

        // assert.throws
        it("Deve lançar erro se userId não existir", () => {
            assert.throws(() => getPostsByUser(999), /Usuário não encontrado/);
        });

        // assert.throws
        it("Deve lançar erro se userId não for número", () => {
            assert.throws(() => getPostsByUser("abc"), /ID inválido/);
        });
    });

    describe("Testes para getPostsByTitle", () => {
        // result.should.be.an().with.lengthOf
        // should.match
        it("Deve buscar posts por título parcial (case insensitive)", () => {
            const result = getPostsByTitle("post");
            
            result.should.be.an("array").with.lengthOf(3);
            result[0].title.should.match(/Post/); // verifica se o título contém a palavra post
        });

        // assert.strictEqual
        it("Deve retornar array vazio se nenhum título encontrado", () => {
            const result = getPostsByTitle("inexistente");
            assert.strictEqual(result.length, 0);
        });

        // assert.throws
        it("Deve lançar erro se título não for string", () => {
            assert.throws(() => getPostsByTitle(123), /Título buscado inválido/);
        });
    })

    describe("Testes para createFakePost", () => {
        // expect().to.have.property().equal
        it("Deve criar um novo post corretamente", () => {
            createFakePost(2, "Novo Post", "Conteúdo do novo post");
            const result = posts.find(p => p.title === "Novo Post");

            expect(result).to.have.property("id").equal(4);
            expect(result).to.have.property("userId").equal(2);
            expect(result).to.have.property("title").equal("Novo Post");
            expect(result).to.have.property("body").equal("Conteúdo do novo post");
        });

        // assert.throws
        it("Deve lançar erro ao criar post com dados incompletos", () => {
            assert.throws(() => createFakePost(1, "", "Sem título"), /Todas as informações são obrigatórias/);
            assert.throws(() => createFakePost(), /Todas as informações são obrigatórias/);
        });
    })

    describe("Testes para deletePostById", () => {
        // expect().to.be.false
        // expect().to.equal
        it("Deve remover um post existente pelo ID", () => {
            const originalLength = posts.length;
            createFakePost(99, "Post temporário", "Conteúdo temporário");
            // pega o id do post criado (último elemento)
            const tempId = posts[posts.length - 1].id;

            // Confirma que o post foi criado
            expect(posts.some(p => p.id === tempId)).to.be.true;
            expect(posts.length).to.equal(originalLength + 1);

            // Deleta o post criado
            deletePostById(tempId);

            // Verifica que o post não existe mais e o tamanho voltou ao original
            expect(posts.some(p => p.id === tempId)).to.be.false;
            expect(posts.length).to.equal(originalLength);
        });
        // assert.throws
        it("Deve lançar erro ao tentar remover um post inexistente", () => {
            assert.throws(() => deletePostById(9999), /Post não encontrado/);
        });

        // assert.throws
        it("Deve lançar erro se o ID não for um número", () => {
            assert.throws(() => deletePostById("abc"), /ID inválido/);
            assert.throws(() => deletePostById(null), /ID inválido/);
        });
    });
});
