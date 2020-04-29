CREATE TABLE reported_workout (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    reporter_id BIGSERIAL NOT NULL REFERENCES person(id),
    workout_id BIGSERIAL NOT NULL REFERENCES workout(id),
    reason VARCHAR(1000) NOT NULL
);