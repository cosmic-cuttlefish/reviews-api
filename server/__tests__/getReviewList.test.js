const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");
let server, agent;

beforeEach(done => {
  server = app.listen(4000, err => {
    if (err) return done(err);
    agent = request.agent(server); // since the application is already listening, it should use the allocated port
    done();
  });
});

afterEach(done => {
  return server.close(done);
});

describe("GET /:productid/list", () => {
  test("It should respond with a correctly formatted array of results", async done => {
    const response = await request(app).get("/253/list");
    expect(response.statusCode).to.eql(200);
    expect(response.body).to.have.property("results");
    const { results } = response.body;
    expect(results).to.be.an.instanceOf(Array);
    for (let result of results) {
      expect(result.review_id).to.be.greaterThan(0);
      expect(result.rating <= 5).to.be.true;
      expect(result.rating > 0).to.be.true;
      expect(result.summary).to.be.a("string");
      expect(result.recommend === 0 || result.recommend === 1).to.be.true;
      expect(result.response).to.be.a("string");
      expect(result.body).to.be.a("string");
      expect(result.body.length).to.be.greaterThan(50);
      expect(result.date).to.exist;
      expect(result.reviewer_name).to.be.a("string");
      expect(result.helpfulness).to.be.greaterThan(0);
      expect(result.photos).to.be.an.instanceOf(Array);
    }
    done();
  });

  test("it should contain correct top-level information", async done => {
    const response = await request(app).get("/253/list");
    expect(response.statusCode).to.eql(200);
    expect(response.body.product).to.eql("253");
    expect(response.body.page).to.eql(0);
    expect(response.body.count).to.eql(response.body.results.length);
    done();
  });
});
