CREATE TABLE workout (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    required_equipment VARCHAR(1000),
    start_time TIMESTAMP NOT NULL,
    link VARCHAR(1000) NOT NULL
);