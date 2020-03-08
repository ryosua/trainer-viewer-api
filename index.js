const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    type Hike {
        id: ID
        url: String
    }

    type Query {
        hikes: [Hike]
    }
`

const hikes = [
    {
        id: '1',
        url: 'https://www.alltrails.com/trail/us/colorado/south-boulder-peak-trail'
    },
    {
        id: '2',
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
