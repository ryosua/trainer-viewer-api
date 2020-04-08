const orm = require('../../orm')
const mapWorkout = require('../mappers/workout')
const getAllWorkoutCategoriesWithWorkoutId = require('./getAllWorkoutCategoriesWithWorkoutId')

const getWorkouts = async () => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecords] = await orm.query('SELECT * FROM workout order by start_time DESC')
    const workouts = workoutRecords.map((workout) => mapWorkout(workout, workoutCategories))
    return workouts
}

module.exports = getWorkouts
