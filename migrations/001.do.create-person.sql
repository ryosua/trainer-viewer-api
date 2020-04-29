CREATE TABLE person (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    date_user_agreement_signed TIMESTAMP,
    email VARCHAR(1000) NOT NULL
);