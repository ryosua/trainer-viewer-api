import ReportedWorkoutRecord from '../types/ReportedWorkoutRecord'
import ReportedWorkout from '../../graphql/types/ReportedWorkout'
import Workout from '../../graphql/types/Workout'
import User from '../../graphql/types/User'

const map = ({ id, reason }: ReportedWorkoutRecord, workout: Workout, reporter: User): ReportedWorkout => ({
    id,
    reporter,
    workout,
    reason
})

export default map
