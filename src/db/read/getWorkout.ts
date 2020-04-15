import { QueryTypes } from 'sequelize'

import WorkoutRecord from '../types/WorkoutRecord'
import UserRecord from '../types/UserRecord'
import orm from '../../orm'
import mapUser from '../mappers/user'
import mapWorkout from '../mappers/workout'
import getAllWorkoutCategoriesWithWorkoutId from './getAllWorkoutCategoriesWithWorkoutId'

const getWorkout = async (id: any) => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecord]: WorkoutRecord[] = await orm.query('SELECT * FROM workout where id = :id', {
        replacements: { id },
        type: QueryTypes.SELECT
    })

    if (!workoutRecord) {
        throw new Error('Workout not found')
    }

    const [userRecord]: UserRecord[] = await orm.query('SELECT * FROM person where id = :trainer_id', {
        replacements: { trainer_id: workoutRecord.trainer_id },
        type: QueryTypes.SELECT
    })

    if (!userRecord) {
        throw new Error('Trainer not found')
    }

    const trainer = mapUser(userRecord)

    const workout = mapWorkout(workoutRecord, workoutCategories, trainer)
    return workout
}

export default getWorkout
