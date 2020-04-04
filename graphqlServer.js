const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const orm = require('./orm')
const mapWorkout = require('./sql/mappers/workout')
const mapWorkoutCategory = require('./sql/mappers/workoutCategory')

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

function getKey(header, cb) {
    client.getSigningKey(header.kid, function(err, key) {
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
        addWorkout(title: String!, requiredEquipment: String, startTime: String!, link: String!): Workout
    }
`

const authenticate = async context => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
}

const resolvers = {
    Query: {
        workouts: async (parent, args, context) => {
            const [results] = await orm.query('SELECT * FROM workout')
            const workouts = results.map(mapWorkout)
            return workouts
        },
        workoutCategories: async (parent, args, context) => {
            const [results] = await orm.query('SELECT * FROM workout_category')
            const workoutCategories = results.map(mapWorkoutCategory)
            return workoutCategories
        }
    },
    Mutation: {
        addWorkout: async (parent, args, context) => {
            await authenticate(context)

            const { title, requiredEquipment, startTime, link } = args
            const [[result]] = await orm.query(
                `INSERT INTO workout ( title, required_equipment, start_time, link) VALUES (:title, :required_equipment, :start_time, :link) RETURNING id, title, required_equipment, start_time, link`,
                {
                    replacements: { title, required_equipment: requiredEquipment, start_time: startTime, link },
                    type: orm.QueryTypes.INSERT
                }
            )
            return mapWorkout(result)
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
        }).catch(e => {
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
