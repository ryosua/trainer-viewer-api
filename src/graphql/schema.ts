const { gql } = require('apollo-server')

const typeDefs: any = gql`
    type Workout {
        id: Int!
        title: String!
        startTime: String!
        link: String!
        requiredEquipment: String
        categories: [WorkoutCategory]!
        duration: Int!
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
