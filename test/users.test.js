const { users, getAllUsers, getUserById, getUserByName, getUserByEmail } = require("../src/users");
const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

describe("Testes para users.js", () => {
    beforeEach(() => {
        // garante que sempre temos os 3 usuários antes de cada teste
        users.length = 0;
        users.push(
            { id: 1, name: "Alice", email: "alice@email.com" },
            { id: 2, name: "Maria", email: "maria@email.com" },
            { id: 3, name: "João", email: "joao@email.com" }
        );
    });

    describe("Testes para getAllUsers", () => {
        // assert.deepEqual
        it("Deve retornar todos os usuários corretamente", () => {
            const result = getAllUsers();
            assert.deepEqual(result, users);
        });

        // assert.throws
        it("Deve lançar erro se não houver usuários", () => {
            while(users.length > 0) users.pop(); // esvazia a lista

            assert.throws(() => getAllUsers(), /Nenhum usuário encontrado/);
        });
        
        // should.be.an + with.lengthOf
        // should.contain
        it("Busca por nome parcial deve retornar Maria", () => {
            const result = getUserByName("ar");
            result.should.be.an("array").with.lengthOf(1);
            result[0].name.should.contain("Maria");
        });

        // 5) expect().to.match + regex de e-mail
        it("Email do João deve ter formato válido", () => {
            const result = getUserById(3);
            expect(result.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });

        // 9) assert.throws
        it("Deve lançar erro se não houver usuários cadastrados", () => {
            users.length = 0; // zera a lista
            assert.throws(() => getAllUsers(), /Nenhum usuário encontrado/);
        });
    });

    describe("Testes para getUserById", () => {
        // expect.to.throw + to.not.throw
        it("Deve lançar erro se ID for inválido", () => {
            expect(() => getUserById(null)).to.throw("ID inválido");
            expect(() => getUserById(1)).to.not.throw();
        });

        // assert.throws + assert.doesNotThrow
        it("Deve lançar erro se nenhum usuário for encontrado", () => {
            assert.throws(() => getUserById(999), /Usuário não encontrado/);
            assert.doesNotThrow(() => getUserById(1));
        });

        // assert.strictEqual
        it("Deve retornar o usuário correto pelo ID", () => {
            const user = getUserById(1);
            assert.strictEqual(user.name, "Alice");
        });

        //expect.to.have.property / to.be.a
        it("Usuário retornado deve ter email como string", () => {
            const user = getUserById(2);
            expect(user).to.have.property("email").to.be.a("string");
        });
    })

    describe("Testes para getUserByName", () => {
        // expect().to.have.lengthOf + and.to.be.an
        // should.equal
        it("Busca por nome completo deve retornar um usuário", () => {
            const result = getUserByName("Alice");
            expect(result).to.have.lengthOf(1).and.to.be.an("array");
            result[0].name.should.equal("Alice");
        });

        // should.be.an + with.lengthOf
        it("Busca por nome parcial deve retornar dois usuários", () => {
            const result = getUserByName("a");
            result.should.be.an("array").with.lengthOf(2);
        });

        // assert.strictEqual
        it("Busca por nome inexistente deve retornar array vazio", () => {
            const result = getUserByName("Inexistente");
            assert.strictEqual(result.length, 0);
        });

        // assert.throws
        it("Deve lançar erro se o nome não for string", () => {
            assert.throws(() => getUserByName(123), /Nome inválido/);
        });
    });

    describe("Testes para getUserByEmail", () => {
        // expect().to.have.lengthOf + and.to.be.an
        // should.equal
        it("Busca por e-mail completo deve retornar um usuário", () => {
            const result = getUserByEmail("alice@email.com");
            expect(result).to.have.lengthOf(1).and.to.be.an("array");
            result[0].email.should.equal("alice@email.com");
        });

        // expect().to.have + should.be.an
        it("Busca por email parcial deve retornar todos os usuários", () => {
            const result = getUserByEmail("email.com");
            expect(result).to.have.lengthOf(3);
            result.should.be.an("array");
        });

        // assert.strictEqual
        it("Busca por e-mail inexistente deve retornar array vazio", () => {
            const result = getUserByEmail("naoexiste@gmail.com");
            assert.strictEqual(result.length, 0);
        });

        // assert.throws
        it("Deve lançar erro se o email não for string", () => {
            assert.throws(() => getUserByEmail(null), /E-mail inválido/);
        }); 
    });
});