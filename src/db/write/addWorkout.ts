import orm from '../../orm'
import { QueryTypes } from 'sequelize'

import User from '../../graphql/types/User'
import getWorkout from '../read/getWorkout'
import associateWorkoutCategoriesWithWorkout from './associateWorkoutCategoriesWithWorkout'

const addWorkout = async (args: any, validCategories: number[], user: User) => {
    const { title, requiredEquipment, startTime, link, duration } = args

    const [[workoutRecord]]: any = await orm.query(
        `INSERT INTO workout (title, ${
            requiredEquipment ? 'required_equipment,' : ''
        } start_time, link, duration, trainer_id) VALUES (:title, ${
            requiredEquipment ? ':required_equipment,' : ''
        } :start_time, :link, :duration, :trainer_id) RETURNING id`,
        {
            replacements: {
                title,
                required_equipment: requiredEquipment,
                start_time: startTime,
                link,
                duration,
                trainer_id: user.id
            },
            type: QueryTypes.INSERT
        }
    )

    // Insert records into workout_workout_category.
    const workoutId = workoutRecord.id
    associateWorkoutCategoriesWithWorkout(workoutId, validCategories)

    const updatedWorkout = getWorkout(workoutId)
    return updatedWorkout
}

export default addWorkout
