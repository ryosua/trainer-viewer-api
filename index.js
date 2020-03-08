const { ApolloServer, gql } = require('apollo-server')

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

const hikes = [
    {
        id: '1',
        carpoolOptions: "Let's meet at the trailhead",
        elevationGain: 2913,
        expectedRoundTripTime: 180,
        name: 'South Boulder Peak Trail',
        miles: 7.8,
        parkingLocation: 'https://www.google.com/maps/dir/Current+Location/39.93879,-105.25806',
        preparationNotes: 'The trail will likely be icy towards the top, bring spikes.',
        startingElevation: 5630,
        time: new Date(Date.now()).toISOString(),
        url: 'https://www.alltrails.com/trail/us/colorado/south-boulder-peak-trail'
    },
    {
        id: '2',
        carpoolOptions: "Let's meet at the trailhead",
        elevationGain: 252,
        miles: 2.4,
        name: 'Keyhole via Wild Loop Trail',
        parkingLocation: 'https://www.google.com/maps/dir/Current+Location/40.41201,-105.15261',
        preparationNotes: 'The trail may be muddy, bring hiking boots.',
        expectedRoundTripTime: 60,
        startingElevation: 5084,
        time: new Date(Date.now()).toISOString(),
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
