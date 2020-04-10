import dotenv from 'dotenv'

dotenv.config()

import orm from './orm'
import graphqlServer from './graphql/graphqlServer'

graphqlServer.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
    console.log(`🚀 Server ready at ${url}`)
    orm.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch((err: Error) => {
            console.error('Unable to connect to the database:', err)
        })
})
