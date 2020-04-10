CREATE TABLE workout (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    duration SMALLINT NOT NULL,
    link VARCHAR(1000) NOT NULL,
    required_equipment VARCHAR(1000),
    start_time TIMESTAMP NOT NULL,
    title VARCHAR(1000) NOT NULL,
    trainer_id BIGSERIAL NOT NULL REFERENCES person(id)
);