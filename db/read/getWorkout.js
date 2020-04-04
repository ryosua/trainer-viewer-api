const orm = require('../../orm')
const mapWorkout = require('../../sql/mappers/workout')
const getAllWorkoutCategoriesWithWorkoutId = require('./getAllWorkoutCategoriesWithWorkoutId')

const getWorkout = async (id) => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecord] = await orm.query('SELECT * FROM workout where id = :id', {
        replacements: { id },
        type: orm.QueryTypes.SELECT
    })
    const workout = mapWorkout(workoutRecord, workoutCategories)
    return workout
}

module.exports = getWorkout
