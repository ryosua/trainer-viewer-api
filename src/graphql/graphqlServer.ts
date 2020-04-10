import { ApolloServer } from 'apollo-server'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import Workout from './types/Workout'
import schema from './schema'
import validateAddWorkout from './validators/addWorkout'
import addWorkout from '../db/write/addWorkout'
import getWorkoutCategories from '../db/read/getWorkoutCategories'
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
