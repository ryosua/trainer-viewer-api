const intersection = require('lodash/intersection')

const orm = require('../../orm')

const getWorkoutInsertString = (workoutCategories) =>
    workoutCategories.reduce(
        (accumulator, workoutCategoryId, index) =>
            accumulator + `(:workout_id, ${workoutCategoryId})${index === workoutCategories.length - 1 ? '' : ','}`,
        ''
    )

const associateWorkoutCategoriesWithWorkout = async (workoutId, workoutCategories) => {
    await orm.query(
        `INSERT INTO workout_workout_category (workout_id, workout_category_id) VALUES ${getWorkoutInsertString(
            workoutCategories
        )}`,
        {
            replacements: { workout_id: workoutId },
            type: orm.QueryTypes.INSERT
        }
    )
}

module.exports = associateWorkoutCategoriesWithWorkout
