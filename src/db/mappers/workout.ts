import WorkoutRecord from '../types/Workout'
import Workout from '../../graphql/types/Workout'

const map = (
    { id, title, required_equipment, start_time, link, duration }: WorkoutRecord,
    workoutCategories: any
): Workout => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter((workoutCategory: any) => workoutCategory.workoutId === id),
    duration
})

export default map
