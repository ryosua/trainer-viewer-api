import orm from '../../orm'
import workoutCategory from '../mappers/workoutCategory'

const getWorkoutCategories = async () => {
    const [results] = await orm.query('SELECT * FROM workout_category')
    const workoutCategories = results.map(workoutCategory)
    return workoutCategories
}

export default getWorkoutCategories
