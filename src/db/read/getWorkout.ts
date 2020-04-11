import { QueryTypes } from 'sequelize'

import WorkoutRecord from '../types/WorkoutRecord'
import orm from '../../orm'
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
    const workout = mapWorkout(workoutRecord, workoutCategories)
    return workout
}

export default getWorkout
