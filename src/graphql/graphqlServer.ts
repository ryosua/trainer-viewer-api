const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

import schema from './schema'
import validateAddWorkout from './validators/addWorkout'
const addWorkout = require('../../db/write/addWorkout')
const getWorkoutCategories = require('../../db/read/getWorkoutCategories')
const getWorkouts = require('../../db/read/getWorkouts')

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

function getKey(header: any, cb: any) {
    client.getSigningKey(header.kid, function (err: Error, key: any) {
        var signingKey = key.publicKey || key.rsaPublicKey
        cb(null, signingKey)
    })
}

const options = {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
}

const resolvers = {
    Query: {
        workouts: async () => {
            const workouts = await getWorkouts()
            return workouts
        },
        workoutCategories: async () => {
            const workoutCategories = await getWorkoutCategories()
            return workoutCategories
        }
    },
    Mutation: {
        addWorkout: async (parent: any, args: any, context: any) => {
            const validCategories = await validateAddWorkout(args, context)
            const workout = await addWorkout(args, validCategories)
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
            jwt.verify(token, getKey, options, (err: Error, decoded: any) => {
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

module.exports = server
