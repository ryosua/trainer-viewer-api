import User from './User'

interface Workout {
    id: Number
    title: String
    startTime: String
    link: String
    requiredEquipment: String
    categories: [any]
    duration: Number
    trainer: User
}

export default Workout
