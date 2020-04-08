const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
const intersection = require('lodash/intersection')

const schema = require('./schema')
const addWorkout = require('../db/write/addWorkout')
const getWorkoutCategories = require('../db/read/getWorkoutCategories')
const getWorkouts = require('../db/read/getWorkouts')

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

function getKey(header, cb) {
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey
        cb(null, signingKey)
    })
}

const options = {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
}

const authenticate = async (context) => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
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
        addWorkout: async (parent, args, context) => {
            await authenticate(context)

            const { categories, duration } = args

            const durationDivisbleBy10 = duration % 10 === 0
            if (!durationDivisbleBy10) {
                throw new Error('The duration must be increments of 10 minutes')
            }

            const minDuration = 20
            const maxDuration = 90
            const durationInRange = duration >= minDuration && duration <= maxDuration
            if (!durationInRange) {
                throw new Error(`You must select a duration between ${minDuration} and ${maxDuration}.`)
            }

            if (categories.length <= 0 || categories.length > 2) {
                throw new Error('You must select at least one category and most two categories.')
            }

            // Validate that the workout categories are in the database.
            const allWorkoutCategories = await getWorkoutCategories()
            const allWorkoutCategoriesIds = allWorkoutCategories.map((workoutCategory) => Number(workoutCategory.id))
            const validCategories = intersection(categories, allWorkoutCategoriesIds)
            if (categories.length !== validCategories.length) {
                throw new Error('Invalid workout category.')
            }

            const workout = await addWorkout(args, validCategories)
            return workout
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization
        const noTokenErrorMessage = 'no token'

        const user = new Promise((resolve, reject) => {
            if (!token) {
                return reject(new Error(noTokenErrorMessage))
            }
            jwt.verify(token, getKey, options, (err, decoded) => {
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
