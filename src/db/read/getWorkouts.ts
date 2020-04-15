import { QueryTypes } from 'sequelize'
import orm from '../../orm'
import mapUser from '../mappers/user'
import mapWorkout from '../mappers/workout'
import User from '../../graphql/types/User'
import Workout from '../../graphql/types/Workout'
import getAllWorkoutCategoriesWithWorkoutId from './getAllWorkoutCategoriesWithWorkoutId'
import WorkoutRecord from '../types/WorkoutRecord'
import UserRecord from '../types/UserRecord'

const getWorkouts = async (): Promise<Workout[]> => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const workoutRecords: WorkoutRecord[] = await orm.query('SELECT * FROM workout order by start_time DESC', {
        type: QueryTypes.SELECT
    })

    const userRecords: UserRecord[] = await orm.query('SELECT * FROM person', {
        type: QueryTypes.SELECT
    })
    const users = userRecords.map(mapUser)

    const workouts = workoutRecords.map((workoutRecord: WorkoutRecord) => {
        const trainerForWorkout = users.find((user) => workoutRecord.trainer_id === user.id)
        if (!trainerForWorkout) {
            throw new Error('All workouts must have a trainer.')
        }
        return mapWorkout(workoutRecord, workoutCategories, trainerForWorkout)
    })

    return workouts
}

export default getWorkouts
