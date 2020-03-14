const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { ApolloClient } = require('apollo-client')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

dotenv.config()

const httpLink = createHttpLink({
    uri: process.env.GRAPH_CMS_ENDPOINT,
    fetch: fetch
})

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

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
    type Hike {
        id: ID!
        carpoolOptions: String
        elevationGain: Int!
        expectedRoundTripTime: Int!
        miles: Float!
        name: String!
        parkingLocation: String!
        preparationNotes: String
        startingElevation: Int!
        time: String!
        url: String
    }

    type Query {
        hikes: [Hike]
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
        hikes: async (parent, args, context) => {
            // await authenticate(context)

            const payload = await apolloClient.query({
                query: gql`
                    query ViewHikes {
                        hikes {
                            id
                            carpoolOptions
                            elevationGain
                            expectedRoundTripTime
                            miles
                            name
                            parkingLocation
                            preparationNotes
                            startingElevation
                            time
                            url
                        }
                    }
                `
            })
            return payload.data.hikes
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

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
