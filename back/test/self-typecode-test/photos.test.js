const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
chai.should();

const BASE_URL = "https://my-json-server.typicode.com/mari-r0sa/mini-app-node-tests";

describe("Testes para photos (SELF API JSONPlaceholder)", () => {
  describe("Testes para getAllPhotos (SELF API JSONPlaceholder)", () => {
    it("Deve retornar todas as fotos da API", async () => {
      const response = await fetch(`${BASE_URL}/photos`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.be.an("array");
    });
  });

  describe("Testes para getPhotoById (SELF API JSONPlaceholder)", () => {
    it("Deve retornar uma foto existente", async () => {
      const photoId = 1;
      const response = await fetch(`${BASE_URL}/photos/${photoId}`);
      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data).to.have.property("id", photoId);
    });
  });
});
