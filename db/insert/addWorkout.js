const orm = require('../../orm')
const mapWorkout = require('../../sql/mappers/workout')

const addWorkout = async (args, mappedWorkoutCategories) => {
    const { title, requiredEquipment, startTime, link, workoutCategories } = args

    // todo - Validate that the workout categories are in the database.

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

    // todo - Update mutation resolver insert records into workout_workout_category .

    return mapWorkout(result, mappedWorkoutCategories)
}

module.exports = addWorkout
