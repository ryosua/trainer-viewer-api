const intersection = require('lodash/intersection')

const orm = require('../../orm')
const mapWorkout = require('../../sql/mappers/workout')
const getWorkoutCategories = require('../read/getWorkoutCategories')
const getAllWorkoutCategoriesWithWorkoutId = require('../read/getAllWorkoutCategoriesWithWorkoutId')

const addWorkout = async (args) => {
    const { title, requiredEquipment, startTime, link, workoutCategories } = args

    // todo - Validate that the workout categories are in the database.
    const allWorkoutCategories = await getWorkoutCategories()
    const allWorkoutCategoriesIds = allWorkoutCategories.map((workoutCategory) => Number(workoutCategory.id))
    const validCategories = intersection(workoutCategories, allWorkoutCategoriesIds)
    if (workoutCategories.length !== validCategories.length) {
        throw new Error('Invalid workout category.')
    }

    const [[result]] = await orm.query(
        `INSERT INTO workout (title, ${
            requiredEquipment ? 'required_equipment,' : ''
        } start_time, link) VALUES (:title, ${
            requiredEquipment ? 'required_equipment,' : ''
        } :start_time, :link) RETURNING id, title, required_equipment, start_time, link`,
        {
            replacements: { title, required_equipment: requiredEquipment, start_time: startTime, link },
            type: orm.QueryTypes.INSERT
        }
    )

    const mappedWorkoutCategories = await getAllWorkoutCategoriesWithWorkoutId()

    // todo - Update mutation resolver insert records into workout_workout_category .

    return mapWorkout(result, mappedWorkoutCategories)
}

module.exports = addWorkout
