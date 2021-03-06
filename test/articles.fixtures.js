function makeArticlesArray() {
  return [
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
}

function makeMaliciousArticle() {
  const maliciousArticle = {
    id: 911,
    style: "How-to",
    date_published: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedArticle = {
    ...maliciousArticle,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousArticle,
    expectedArticle,
  };
}

module.exports = {
  makeArticlesArray,
  makeMaliciousArticle,
};
