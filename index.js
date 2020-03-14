const { ApolloServer, gql } = require('apollo-server')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { ApolloClient } = require('apollo-client')

dotenv.config()

const httpLink = createHttpLink({
    uri: process.env.GRAPH_CMS_ENDPOINT,
    fetch: fetch
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

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

const resolvers = {
    Query: {
        hikes: async (parent, args, context, info) => {
            const payload = await client.query({
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
    playground: true,
    introspection: true
})

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
