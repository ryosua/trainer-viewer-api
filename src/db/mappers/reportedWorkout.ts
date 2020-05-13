import ReportedWorkoutRecord from '../types/ReportedWorkoutRecord'
import { Workout, User, ReportedWorkout } from '../../shared'

const map = ({ id, reason }: ReportedWorkoutRecord, workout: Workout, reporter: User): ReportedWorkout => ({
    id,
    reporter,
    workout,
    reason
})

export default map
