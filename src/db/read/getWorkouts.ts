import orm from '../../orm'
import mapWorkout from '../mappers/workout'
import getAllWorkoutCategoriesWithWorkoutId from './getAllWorkoutCategoriesWithWorkoutId'

const getWorkouts = async () => {
    const workoutCategories = await getAllWorkoutCategoriesWithWorkoutId()
    const [workoutRecords] = await orm.query('SELECT * FROM workout order by start_time DESC')
    const workouts = workoutRecords.map((workout: any) => mapWorkout(workout, workoutCategories))
    return workouts
}

export default getWorkouts
