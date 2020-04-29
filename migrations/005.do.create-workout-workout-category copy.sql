CREATE TABLE workout_workout_category (
    workout_id BIGSERIAL NOT NULL REFERENCES workout(id),
    workout_category_id BIGSERIAL NOT NULL REFERENCES workout_category(id)
);