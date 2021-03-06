const express = require("express");
const ArticlesService = require("../services/articles-service");
const articleRouter = express.Router();
const jsonParser = express.json();
const xss = require("xss");
const path = require("path");

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
      .then((newArticle) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${newArticle.id}`))
          .json(serializeArticle(newArticle));
      })
      .catch(next);
  });

articleRouter
  .route("/:article_id")
  .all((req, res, next) => {
    ArticlesService.getById(req.app.get("db"), req.params.article_id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article does not exist` },
          });
        }
        res.article = article;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeArticle(res.article));
  })
  .delete((req, res, next) => {
    ArticlesService.deleteArticle(req.app.get("db"), req.params.article_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const db = req.app.get("db");

    const { title, content, style } = req.body;
    const articleToUpdate = { title, content, style };

    const numberOfValues = Object.values(articleToUpdate).filter(Boolean)
      .length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title' 'style' or 'content'`,
        },
      });
    }

    ArticlesService.updateArticle(db, req.params.article_id, articleToUpdate)
      .then((articleToUpdate) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = articleRouter;
