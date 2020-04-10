import orm from '../../orm'
import { QueryTypes } from 'sequelize'

import mapUser from '../../db/mappers/user'

const addUser = async (email: string) => {
    const [[userRecord]]: any = await orm.query(`INSERT INTO person (email) VALUES (:email) RETURNING id`, {
        replacements: { email },
        type: QueryTypes.INSERT
    })

    const user = mapUser(userRecord)
    return user
}

export default addUser
