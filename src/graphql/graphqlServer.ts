import { ApolloServer } from 'apollo-server'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import ReportedWorkout from './types/ReportedWorkout'
import User from './types/User'
import Workout from './types/Workout'
import schema from './schema'
import authenticate from './validators/authenticate'
import validateUserAgreementSigned from './validators/userAgreementSigned'
import validateAddWorkout from './validators/addWorkout'
import validateDeleteWorkout from './validators/validateDeleteWorkout'
import addReportedWorkout from '../db/write/addReportedWorkout'
import addWorkout from '../db/write/addWorkout'
import deleteWorkout from '../db/write/deleteWorkout'
import signUserAgreement from '../db/write/signUserAgreement'
import getWorkoutCategories from '../db/read/getWorkoutCategories'
import getWorkout from '../db/read/getWorkout'
import getWorkouts from '../db/read/getWorkouts'

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

// @ts-ignore
function getKey(header, cb) {
    client.getSigningKey(header.kid, function (err, key) {
        // @ts-ignore
        var signingKey = key?.publicKey || key?.rsaPublicKey
        cb(null, signingKey)
    })
}

const options: VerifyOptions = {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
}

const resolvers = {
    Query: {
        me: async (parent: any, args: any, context: any): Promise<User> => {
            const me = await authenticate(context)
            return me
        },
        workouts: async (parent: any, args: any, context: any): Promise<Workout[]> => {
            const user = await authenticate(context)
            validateUserAgreementSigned(user)
            const workouts = await getWorkouts()
            return workouts
        },
        workoutCategories: async () => {
            const workoutCategories = await getWorkoutCategories()
            return workoutCategories
        }
    },
    Mutation: {
        addWorkout: async (parent: any, args: any, context: any): Promise<Workout> => {
            const { validCategories, user } = await validateAddWorkout(args, context)
            const workout = await addWorkout(args, validCategories, user)
            return workout
        },
        deleteWorkout: async (parent: any, args: any, context: any): Promise<Workout> => {
            const { workoutId } = args
            const user = await authenticate(context)
            const workout = await getWorkout(workoutId)
            validateDeleteWorkout(user, workout)
            deleteWorkout(workoutId)
            return workout
        },
        reportWorkout: async (parent: any, args: any, context: any): Promise<ReportedWorkout> => {
            const { workoutId, reason } = args
            const reporter = await authenticate(context)
            validateUserAgreementSigned(reporter)
            const workout = await getWorkout(workoutId)
            const reportedWorkout = await addReportedWorkout(workout, reporter, reason)
            return reportedWorkout
        },
        signUserAgreement: async (parent: any, args: any, context: any): Promise<User> => {
            const signer = await authenticate(context)
            const updatedUser = signUserAgreement(signer)
            return updatedUser
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }: any) => {
        const token = req.headers.authorization
        const noTokenErrorMessage = 'no token'

        const user = new Promise((resolve, reject) => {
            if (!token) {
                return reject(new Error(noTokenErrorMessage))
            }
            jwt.verify(token, getKey, options, (err, decoded: any) => {
                if (err) {
                    return reject(err)
                }
                resolve(decoded.email)
            })
        }).catch((e) => {
            if (e.message === noTokenErrorMessage) {
                // Swallow error. That's ok, they will get an unauth error
            } else {
                throw e
            }
        })

        return {
            user
        }
    },
    playground: true,
    introspection: true
})

export default server
