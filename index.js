const dotenv = require('dotenv')
dotenv.config()
const orm = require('./orm')
const server = require('./graphql/graphqlServer')

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
    orm.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err)
        })
})
