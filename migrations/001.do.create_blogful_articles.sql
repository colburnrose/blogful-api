CREATE TABLE blogful_articles(
id integer primary key generated by default as identity,
title text not null,
content text,
date_published timestamp default now() not null
)