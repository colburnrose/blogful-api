const express = require("express");
const { isWebUri } = require("valid-url");
const ArticlesService = require("../services/articles-service");
const articleRouter = express.Router();
const jsonParser = express.json();
const xss = require("xss");

const serializeArticle = (article) => ({
  id: article.id,
  style: article.style,
  title: xss(article.title), // sanitize title
  content: xss(article.content), // sanitize content
  date_published: article.date_published,
});

articleRouter
  .route("/")
  .get((req, res, next) => {
    ArticlesService.getAllArticles(req.app.get("db"))
      .then((articles) => {
        res.json(articles.map(serializeArticle));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, style } = req.body;
    const newArticle = { title, content, style };

    for (const [key, value] of Object.entries(newArticle)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ArticlesService.insertArticle(req.app.get("db"), newArticle)
      .then((article) => {
        res
          .status(201)
          .location(`/articles/${article.id}`)
          .json(serializeArticle(article));
      })
      .catch(next);
  });

articleRouter
  .route("/:article_id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ArticlesService.getById(knexInstance, req.params.article_id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article does not exist` },
          });
        }
        res.json(serializeArticle(article));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ArticlesService.deleteArticle(req.app.get("db"), req.params.article_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = articleRouter;
