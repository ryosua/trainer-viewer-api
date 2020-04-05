const intersection = require('lodash/intersection')

const orm = require('../../orm')
const getWorkout = require('../read/getWorkout')
const getWorkoutCategories = require('../read/getWorkoutCategories')
const associateWorkoutCategoriesWithWorkout = require('./associateWorkoutCategoriesWithWorkout')

const addWorkout = async (args) => {
    const { title, requiredEquipment, startTime, link, categories } = args

    if (categories.length <= 0 || categories.length > 2) {
        throw new Error('You must select at least one category and most two categories.')
    }

    // Validate that the workout categories are in the database.
    const allWorkoutCategories = await getWorkoutCategories()
    const allWorkoutCategoriesIds = allWorkoutCategories.map((workoutCategory) => Number(workoutCategory.id))
    const validCategories = intersection(categories, allWorkoutCategoriesIds)
    if (categories.length !== validCategories.length) {
        throw new Error('Invalid workout category.')
    }

    const [[workoutRecord]] = await orm.query(
        `INSERT INTO workout (title, ${
            requiredEquipment ? 'required_equipment,' : ''
        } start_time, link) VALUES (:title, ${
            requiredEquipment ? ':required_equipment,' : ''
        } :start_time, :link) RETURNING id`,
        {
            replacements: { title, required_equipment: requiredEquipment, start_time: startTime, link },
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
