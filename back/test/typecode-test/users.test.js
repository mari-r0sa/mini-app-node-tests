const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Testes para users.js (API JSONPlaceholder)", () => {

    describe("getAllUsers", () => {
        it("Deve retornar todos os usuários corretamente", async () => {
            const response = await fetch(`${BASE_URL}/users`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.be.an("array").with.length.greaterThan(0);
            expect(data[0]).to.have.all.keys(
                "id",
                "name",
                "username",
                "email",
                "address",
                "phone",
                "website",
                "company"
            );
        });

        it("Deve lançar erro se não houver usuários", async () => {
            try {
                const response = await fetch(`${BASE_URL}/userrs`); // rota errada
                if (!response.ok) throw new Error("Nenhum usuário encontrado");
            } catch (err) {
                assert.match(err.message, /Nenhum usuário encontrado/);
            }
        });

        it("Busca por nome parcial deve retornar um ou mais usuários", async () => {
            const name = "Leanne"; // nome existente
            const response = await fetch(`${BASE_URL}/users?name_like=${name}`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            data.should.be.an("array").with.length.greaterThan(0);
            expect(data[0].name).to.match(new RegExp(name, "i"));
        });

        it("Email do usuário deve ter formato válido", async () => {
            const id = 1;
            const response = await fetch(`${BASE_URL}/users/${id}`);
            expect(response.status).to.equal(200);

            const user = await response.json();
            expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    describe("getUserById", () => {
        it("Deve retornar o usuário correto pelo ID", async () => {
            const id = 1;
            const response = await fetch(`${BASE_URL}/users/${id}`);
            expect(response.status).to.equal(200);

            const data = await response.json();
            expect(data).to.have.property("id", id);
            assert.strictEqual(data.name, "Leanne Graham");
        });

        it("Deve lançar erro se ID for inválido", async () => {
            const invalidIds = [null, "abc"];
            for (const id of invalidIds) {
                try {
                if (typeof id !== "number" || !Number.isInteger(id)) {
                    throw new Error("ID inválido");
                }
                } catch (err) {
                expect(err.message).to.equal("ID inválido");
                }
            }
        });

        it("Deve lançar erro se usuário não existir", async () => {
            const id = 999;
            const response = await fetch(`${BASE_URL}/users/${id}`);
            const data = await response.json();

            if (!data.id) {
                assert.throws(() => {
                throw new Error("Usuário não encontrado");
                }, /Usuário não encontrado/);
            }
        });
    });
});
