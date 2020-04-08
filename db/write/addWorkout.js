const orm = require('../../orm')
const getWorkout = require('../read/getWorkout')
const associateWorkoutCategoriesWithWorkout = require('./associateWorkoutCategoriesWithWorkout')

const addWorkout = async (args, validCategories) => {
    const { title, requiredEquipment, startTime, link, duration } = args

    const [[workoutRecord]] = await orm.query(
        `INSERT INTO workout (title, ${
            requiredEquipment ? 'required_equipment,' : ''
        } start_time, link, duration) VALUES (:title, ${
            requiredEquipment ? ':required_equipment,' : ''
        } :start_time, :link, :duration) RETURNING id`,
        {
            replacements: { title, required_equipment: requiredEquipment, start_time: startTime, link, duration },
            type: orm.QueryTypes.INSERT
        }
    )

    // Insert records into workout_workout_category.
    const workoutId = workoutRecord.id
    associateWorkoutCategoriesWithWorkout(workoutId, validCategories)

    const updatedWorkout = getWorkout(workoutId)
    return updatedWorkout
}

module.exports = addWorkout
