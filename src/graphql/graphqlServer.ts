import { ApolloServer } from 'apollo-server'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import ReportedWorkout from './types/ReportedWorkout'
import User from './types/User'
import Workout from './types/Workout'
import schema from './schema'
import authenticate from './validators/authenticate'
import validateAddWorkout from './validators/addWorkout'
import addReportedWorkout from '../db/write/addReportedWorkout'
import addWorkout from '../db/write/addWorkout'
import getWorkoutCategories from '../db/read/getWorkoutCategories'
import getWorkout from '../db/read/getWorkout'
import getWorkouts from '../db/read/getWorkouts'

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

const getKey = (header: any, callback: Function) => {
    client.getSigningKey(header.kid, (err, key: jwksClient.SigningKey) => {
        const signingKey =
            (key as jwksClient.CertSigningKey).publicKey || (key as jwksClient.RsaSigningKey).rsaPublicKey
        callback(null, signingKey)
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
        workouts: async (): Promise<Workout[]> => {
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
        reportWorkout: async (parent: any, args: any, context: any): Promise<ReportedWorkout> => {
            const { workoutId, reason } = args
            const reporter = await authenticate(context)
            const workout = await getWorkout(workoutId)
            const reportedWorkout = await addReportedWorkout(workout, reporter, reason)
            return reportedWorkout
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
