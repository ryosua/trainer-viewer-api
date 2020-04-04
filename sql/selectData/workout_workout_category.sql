SELECT workout_category.id, workout_category.title
FROM workout_category
JOIN workout_workout_category
ON workout_category.id = workout_workout_category.workout_category_id
AND workout_id = 1;