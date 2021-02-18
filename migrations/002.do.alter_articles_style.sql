create type article_category as enum (
'Listicle',
'How-to',
'News',
'Interview',
'Story'
);

alter table blogful_articles
    add COLUMN
        style article_category;