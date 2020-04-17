import { gql } from 'apollo-server'

const typeDefs: any = gql`
    type User {
        id: Int!
        dateUserAgreementSigned: String
    }

    type Workout {
        id: Int!
        categories: [WorkoutCategory]!
        duration: Int!
        link: String!
        requiredEquipment: String
        startTime: String!
        title: String!
        trainer: User!
    }

    type WorkoutCategory {
        id: Int!
        title: String!
    }

    type ReportedWorkout {
        id: Int!
        reporter: User!
        workout: Workout!
        reason: String!
    }

    type Query {
        me: User
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

        reportWorkout(workoutId: Int!, reason: String!): ReportedWorkout
    }
`

export default typeDefs
