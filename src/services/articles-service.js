const ArticlesService = {
  getAllArticles(db) {
    return db.select("*").from("blogful_articles");
  },
  insertArticle(db, newArticle) {
    return db
      .insert(newArticle)
      .into("blogful_articles")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db("blogful_articles").select("*").where({ id }).first();
  },
  deleteArticle(db, id) {
    return db("blogful_articles").where({ id }).delete();
  },
  updateArticle(db, id, data) {
    return db("blogful_articles").where({ id }).update(data);
  },
};

module.exports = ArticlesService;
