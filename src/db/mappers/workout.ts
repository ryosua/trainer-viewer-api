import WorkoutRecord from '../types/WorkoutRecord'
import Workout from '../../graphql/types/Workout'
import mapUser from './user'

const map = (
    { id, title, required_equipment, start_time, link, duration, trainer_id }: WorkoutRecord,
    workoutCategories: any
): Workout => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter((workoutCategory: any) => workoutCategory.workoutId === id),
    duration,
    trainer: mapUser({ id: trainer_id })
})

export default map
