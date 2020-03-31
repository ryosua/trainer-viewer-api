const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
const Sequelize = require('sequelize')
const mapWorkout = require('./sql/mappers/workout')

dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URI)

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
    }

    type Query {
        workouts: [Workout]
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
            const [results] = await sequelize.query('SELECT * FROM workout')
            const workouts = results.map(mapWorkout)
            return workouts
        }
    },
    Mutation: {
        addWorkout: async (parent, args, context) => {
            await authenticate(context)

            const { title, requiredEquipment, startTime, link } = args
            const [[result]] = await sequelize.query(
                `INSERT INTO workout ( title, required_equipment, start_time, link) VALUES (:title, :required_equipment, :start_time, :link) RETURNING id, title, required_equipment, start_time, link`,
                {
                    replacements: { title, required_equipment: requiredEquipment, start_time: startTime, link },
                    type: sequelize.QueryTypes.INSERT
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

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err)
        })
})
