ALTER TABLE reported_workout
DROP CONSTRAINT reported_workout_workout_id_fkey,
ADD CONSTRAINT reported_workout_workout_id_fkey
   FOREIGN KEY (workout_id)
   REFERENCES  workout(id)
   ON DELETE CASCADE;

ALTER TABLE workout_workout_category
DROP CONSTRAINT workout_workout_category_workout_id_fkey,
ADD CONSTRAINT workout_workout_category_workout_id_fkey
   FOREIGN KEY (workout_id)
   REFERENCES  workout(id)
   ON DELETE CASCADE;