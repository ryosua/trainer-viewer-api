const orm = require('../../orm')
const workoutCategory = require('../mappers/workoutCategory')

const getWorkoutCategories = async () => {
    const [results] = await orm.query('SELECT * FROM workout_category')
    const workoutCategories = results.map(workoutCategory)
    return workoutCategories
}

module.exports = getWorkoutCategories
