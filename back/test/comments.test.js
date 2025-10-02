const { comments, getCommentsByPost, getCommentById, createComment, deleteComment } = require("../src/comments");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para comments.js", () => {
    beforeEach(() => {
        comments.length = 0;
        comments.push(
            { id: 1, postId: 1, author: "User1", text: "Primeiro comentário" },
            { id: 2, postId: 1, author: "User2", text: "Segundo comentário" },
            { id: 3, postId: 2, author: "User3", text: "Outro comentário" }
        );
    });

    describe("getCommentsByPost", () => {
        // expect().to.deep.equal
        // assert.strictEqual
        it("Deve retornar todos os comentários de um post existente", () => {
            const result = getCommentsByPost(1);
            expect(result).to.deep.equal([
                { id: 1, postId: 1, author: "User1", text: "Primeiro comentário" },
                { id: 2, postId: 1, author: "User2", text: "Segundo comentário" }
            ]);
            assert.strictEqual(result.length, 2);
        });

        // expect().to.throw
        it("Deve lançar erro se postId for inválido", () => {
            expect(() => getCommentsByPost("abc")).to.throw("postId inválido");
            expect(() => getCommentsByPost(null)).to.throw("postId inválido");
        });

        // assert.throws
        it("Deve lançar erro se o post não existir", () => {
            assert.throws(() => getCommentsByPost(999), /Post não encontrado/);
        });
    });

    describe("getCommentById", () => {
        // expect().to.deep.equal
        // assert.strictEqual
        it("Deve retornar um comentário pelo ID válido", () => {
            const result = getCommentById(2);
            expect(result).to.deep.equal({ id: 2, postId: 1, author: "User2", text: "Segundo comentário" });
            assert.strictEqual(result.postId, 1);
        });

        // expect().to.throw
        // assert.throws
        it("Deve lançar erro se id for inválido", () => {
            expect(() => getCommentById("abc")).to.throw("id inválido");
            assert.throws(() => getCommentById(null), /id inválido/);
        });

        // expect().to.throw
        it("Deve lançar erro se o comentário não existir", () => {
            expect(() => getCommentById(999)).to.throw("Comentário não encontrado");
        });
    });

    describe("createComment", () => {
        // expect().to.have.property().equal
        // should.have.property().equal
        // assert.ok
        it("Deve adicionar um novo comentário válido", () => {
            const result = createComment(1, "User4", "Comentário novo");
            expect(result).to.have.property("id").equal(4);
            result.should.have.property("postId").equal(1);
            result.should.have.property("author").equal("User4");
            result.should.have.property("text").equal("Comentário novo");
            assert.ok(comments.includes(result));
        });

        // assert.throws
        it("Deve lançar erro se postId for inválido", () => {
            assert.throws(() => createComment("abc", "User4", "Texto"), /postId inválido/);
        });

        // assert.throws
        it("Deve lançar erro se author for inválido", () => {
            expect(() => createComment(1, "", "Texto")).to.throw("author inválido");
            assert.throws(() => createComment(1, null, "Texto"), /author inválido/);
        });

        // assert.throws
        it("Deve lançar erro se text for inválido", () => {
            expect(() => createComment(1, "User4", "")).to.throw("text inválido");
            assert.throws(() => createComment(1, "User4", null), /text inválido/);
        });
    });

    describe("deleteComment", () => {
        // expect().to.equal
        // assert.strictEqual
        // should.be.false
        it("Deve deletar um comentário existente", () => {
            const originalLength = comments.length;
            const result = deleteComment(3);
            expect(result).to.equal(true);
            assert.strictEqual(comments.length, originalLength - 1);
            comments.some(c => c.id === 3).should.be.false;
        });

        // expect().to.throw
        // assert.throws
        it("Deve lançar erro se id for inválido", () => {
            expect(() => deleteComment("abc")).to.throw("id inválido");
            assert.throws(() => deleteComment(null), /id inválido/);
        });

        // expect().to.throw
        it("Deve lançar erro se comentário não existir", () => {
            expect(() => deleteComment(999)).to.throw("Comentário com id 999 não encontrado.");
        });
    });
});
