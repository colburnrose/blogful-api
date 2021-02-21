require("dotenv").config();
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Articles Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("blogful_articles").truncate());

  afterEach("cleanup", () => db("blogful_articles").truncate());

  context("Given there are articles in the database", () => {
    const testArticles = [
      {
        id: 1,
        title: "First test post!",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
        date_published: "2029-01-22T22:28:32.615Z",
        style: "How-to",
      },
      {
        id: 2,
        title: "Second test post!",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.",
        date_published: "2100-05-22T22:28:32.615Z",
        style: "News",
      },
      {
        id: 3,
        title: "Third test post!",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.",
        date_published: "1919-12-22T22:28:32.615Z",
        style: "Listicle",
      },
      {
        id: 4,
        title: "Fourth test post!",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum molestiae accusamus veniam consectetur tempora, corporis obcaecati ad nisi asperiores tenetur, autem magnam. Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam?",
        date_published: "1919-12-22T22:28:32.615Z",
        style: "Story",
      },
    ];

    beforeEach("insert articles", () => {
      return db.into("blogful_articles").insert(testArticles);
    });

    it("GET /articles responds with 200 and all of the articles", () => {
      return supertest(app).get("/articles").expect(200);
    });

    it("GET /articles/:article_id responds with 200 and the specified article", () => {
      const articleId = 2;
      const actualArticle = testArticles[articleId - 1];
      return supertest(app)
        .get(`/articles/${articleId}`)
        .expect(200, actualArticle);
    });
  });
});
