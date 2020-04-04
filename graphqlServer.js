const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const addWorkout = require('./db/write/addWorkout')
const getWorkoutCategories = require('./db/read/getWorkoutCategories')
const getWorkouts = require('./db/read/getWorkouts')

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

const typeDefs = gql`
    type Workout {
        id: Int!
        title: String!
        startTime: String!
        link: String!
        requiredEquipment: String
        categories: [WorkoutCategory]!
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
            workoutCategories: [Int]!
        ): Workout
    }
`

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
            const workout = await addWorkout(args)
            return workout
        }
    }
}

const server = new ApolloServer({
    typeDefs,
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
