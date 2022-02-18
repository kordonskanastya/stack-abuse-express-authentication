create table users(
    id int primary key generated always as identity,
    firstName varchar(100) not null,
    lastName varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(1000) not null
);

create table advertisements(
    id int primary key generated always as identity,
    title varchar(100) not null,
    text varchar(100) not null,
    completed bool DEFAULT false,
    fk_user_id int references users(id)
);
