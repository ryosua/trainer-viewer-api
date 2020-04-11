CREATE TABLE reported_workout (
    reporter_id BIGSERIAL NOT NULL REFERENCES person(id),
    workout_id BIGSERIAL NOT NULL REFERENCES workout(id)
);