const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    type Hike {
        id: ID
        miles: Float
        url: String
    }

    type Query {
        hikes: [Hike]
    }
`

const hikes = [
    {
        id: '1',
        miles: 7.8,
        url: 'https://www.alltrails.com/trail/us/colorado/south-boulder-peak-trail'
    },
    {
        id: '2',
        miles: 2.4,
        url: 'https://www.alltrails.com/explore/trail/us/colorado/keyhole-via-wild-loop-trail'
    }
]

const resolvers = {
    Query: {
        hikes: () => hikes
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
