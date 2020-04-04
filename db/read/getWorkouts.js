const orm = require('../../orm')
const mapWorkout = require('../../sql/mappers/workout')
const getAllWorkoutCategoriesWithWorkoutId = require('./getAllWorkoutCategoriesWithWorkoutId')

const getWorkouts = async () => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecords] = await orm.query('SELECT * FROM workout')
    const workouts = workoutRecords.map((workout) => mapWorkout(workout, workoutCategories))
    return workouts
}

module.exports = getWorkouts
