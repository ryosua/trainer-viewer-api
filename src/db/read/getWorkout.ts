const orm = require('../../orm')
const mapWorkout = require('../mappers/workout')
const getAllWorkoutCategoriesWithWorkoutId = require('./getAllWorkoutCategoriesWithWorkoutId')

const getWorkout = async (id: any) => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecord] = await orm.query('SELECT * FROM workout where id = :id', {
        replacements: { id },
        type: orm.QueryTypes.SELECT
    })
    const workout = mapWorkout(workoutRecord, workoutCategories)
    return workout
}

export default getWorkout
