const request = require("supertest");
const { app, handler } = require("../");
const { expect } = require("chai");
handler.close();
let server, agent;

beforeEach(done => {
  server = app.listen(4000, err => {
    if (err) return done(err);
    agent = request.agent(server); // since the application is already listening, it should use the allocated port
    done();
  });
});

afterEach(done => {
  return server && server.close(done);
});

describe("GET /:productid/list", () => {
  test("It should respond with an array of results", async done => {
    const response = await request(app).get("/253/list");
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.be.an.instanceOf(Array);
    expect(response.statusCode).to.eql(200);
    done();
  });
});
