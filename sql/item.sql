drop table if exists item;

create table item (
    id integer primary key generated by default as identity,
    item_name text not null,
    unit text,
    unit_cost numeric,
    supplier integer REFERENCES supplier(id) on DELETE set null-- establishes foreign key relationship
);