import WorkoutRecord from '../types/WorkoutRecord'
import Workout from '../../graphql/types/Workout'
import User from '../../graphql/types/User'
import mapUser from './user'

const map = (
    { id, title, required_equipment, start_time, link, duration }: WorkoutRecord,
    workoutCategories: any,
    trainer: User
): Workout => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter((workoutCategory: any) => workoutCategory.workoutId === id),
    duration,
    trainer
})

export default map
