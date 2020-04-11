import { gql } from 'apollo-server'

const typeDefs: any = gql`
    type User {
        id: Int!
    }

    type Workout {
        id: Int!
        categories: [WorkoutCategory]!
        duration: Int!
        link: String!
        requiredEquipment: String
        startTime: String!
        title: String!
        trainerId: Int!
    }

    type WorkoutCategory {
        id: Int!
        title: String!
    }

    type Query {
        workouts: [Workout]
        workoutCategories: [WorkoutCategory]
    }

    type Mutation {
        addWorkout(
            title: String!
            requiredEquipment: String
            startTime: String!
            link: String!
            categories: [Int]!
            duration: Int!
        ): Workout
    }
`

export default typeDefs
