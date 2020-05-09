import dotenv from 'dotenv'
import wakeUpDyno from './wakeUpDyno'
import Postgrator from 'postgrator'

dotenv.config()

import orm from './orm'
import graphqlServer from './graphql/graphqlServer'

graphqlServer.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
    console.log(`🚀 Server ready at ${url}`)

    // @ts-ignore
    const postgrator = new Postgrator({
        driver: 'pg',
        connectionString: process.env.DATABASE_URI,
        migrationDirectory: './migrations'
    })

    orm.authenticate()
        .then(() => {
            postgrator
                .migrate()
                .then((appliedMigrations: any) => {
                    console.log('Applied migrations: ', appliedMigrations)
                })
                .catch((error: Error) => console.log(error))

            wakeUpDyno(process.env.DYNO_URL ?? '')
        })
        .catch((err: Error) => {
            console.error('Unable to connect to the database:', err)
        })
})
