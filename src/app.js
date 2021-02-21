require("dotenv").config;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const winston = require("winston");
const { v4: uuid } = require("uuid");
const { NODE_ENV } = require("./config");
const errorHandler = require("./errorHandler");
const ArticlesService = require("./services/articles-service");

const app = express();
const morganConfiguration = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganConfiguration));
app.use(helmet());
app.use(cors());
app.use(express.json());

// authorization
// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN;
//   const authToken = req.get("Authorization");

//   if (!authToken || authToken.split(" ")[1] !== apiToken) {
//     logger.error(`Unauthorized request to path: ${req.path}`);
//     return res.status(401).json({ error: "Unauthorized Request!" });
//   }
//   next();
// });

// GET: Returns a list of articles
app.get("/articles", (req, res, next) => {
  const knexInstance = req.app.get("db");
  ArticlesService.getAllArticles(knexInstance)
    .then((articles) => {
      res.json(articles);
    })
    .catch(next);
});

// GET: Returns an articleById
app.get("/articles/:article_id", (req, res, next) => {
  // res.json({ request_id: req.params.article_id, this: "should fail" });
  const knexInstance = req.app.get("db");
  ArticlesService.getById(knexInstance, req.params.article_id)
    .then((article) => {
      res.json(article);
      // res.json({
      //   id: article.id,
      //   title: article.title,
      //   style: article.style,
      //   content: article.content,
      //   date_published: new Date(article.date_published),
      // });
    })
    .catch(next);
});

app.use(errorHandler);

module.exports = app;
