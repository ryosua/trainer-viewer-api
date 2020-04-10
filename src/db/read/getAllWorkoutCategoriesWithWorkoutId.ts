const orm = require('../../orm')
const workoutCategoryWithWorkoutId = require('../mappers/workoutCategoryWithWorkoutId')

const getAllWorkoutCategoriesWithWorkoutId = async () => {
    const [
        workoutCategoryRecords
    ] = await orm.query(`SELECT workout_category.id, workout_category.title, workout_workout_category.workout_id
                        FROM workout_category
                        JOIN workout_workout_category
                        ON workout_category.id = workout_workout_category.workout_category_id`)
    const workoutCategories = workoutCategoryRecords.map(workoutCategoryWithWorkoutId)
    return workoutCategories
}

export default getAllWorkoutCategoriesWithWorkoutId
