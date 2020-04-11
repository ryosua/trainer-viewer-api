import User from './User'
import Workout from './Workout'

interface ReportedWorkout {
    id: Number
    reporter: User
    workout: Workout
    reason: string
}

export default ReportedWorkout
