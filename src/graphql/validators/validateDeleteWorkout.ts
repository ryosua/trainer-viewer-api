import { User, Workout } from '../../shared'

const validateDeleteWorkout = (user: User, workout: Workout): void => {
    const isAuthorized = user.id === workout.trainer.id
    if (!isAuthorized) {
        throw new Error('You can only delete workouts that you have created.')
    }
}

export default validateDeleteWorkout
