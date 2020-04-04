const orm = require('../../orm')
const workoutCategory = require('../../sql/mappers/workoutCategory')

const getWorkoutCategories = async () => {
    const [results] = await orm.query('SELECT * FROM workout_category')
    const workoutCategories = results.map(workoutCategory)
    console.log('workout categories', JSON.stringify(workoutCategories))
    return workoutCategories
}

module.exports = getWorkoutCategories
