export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

export type Mutation = {
    __typename?: 'Mutation'
    addWorkout?: Maybe<Workout>
    addUser?: Maybe<User>
    deleteWorkout?: Maybe<Workout>
    reportWorkout?: Maybe<ReportedWorkout>
    signUserAgreement?: Maybe<User>
}

export type MutationAddWorkoutArgs = {
    title: Scalars['String']
    requiredEquipment?: Maybe<Scalars['String']>
    startTime: Scalars['String']
    link: Scalars['String']
    categories: Array<Maybe<Scalars['Int']>>
    duration: Scalars['Int']
}

export type MutationAddUserArgs = {
    email: Scalars['String']
    secret: Scalars['String']
}

export type MutationDeleteWorkoutArgs = {
    workoutId: Scalars['Int']
}

export type MutationReportWorkoutArgs = {
    workoutId: Scalars['Int']
    reason: Scalars['String']
}

export type Query = {
    __typename?: 'Query'
    me?: Maybe<User>
    workouts?: Maybe<Array<Maybe<Workout>>>
    workoutCategories?: Maybe<Array<Maybe<WorkoutCategory>>>
}

export type ReportedWorkout = {
    __typename?: 'ReportedWorkout'
    id: Scalars['Int']
    reporter: User
    workout: Workout
    reason: Scalars['String']
}

export type User = {
    __typename?: 'User'
    id: Scalars['Int']
    dateUserAgreementSigned?: Maybe<Scalars['String']>
}

export type Workout = {
    __typename?: 'Workout'
    id: Scalars['Int']
    categories: Array<Maybe<WorkoutCategory>>
    duration: Scalars['Int']
    link: Scalars['String']
    requiredEquipment?: Maybe<Scalars['String']>
    startTime: Scalars['String']
    title: Scalars['String']
    trainer: User
}

export type WorkoutCategory = {
    __typename?: 'WorkoutCategory'
    id: Scalars['Int']
    title: Scalars['String']
}
