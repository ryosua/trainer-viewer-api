import { QueryTypes } from 'sequelize'

import orm from '../../orm'
import mapUser from '../mappers/user'
import UserRecord from '../types/UserRecord'
import { User } from '../../shared'

const getUser = async (email: string): Promise<User> => {
    const [userRecord]: UserRecord[] = await orm.query(
        'SELECT id, date_user_agreement_signed FROM person where email = :email',
        {
            replacements: { email },
            type: QueryTypes.SELECT
        }
    )
    const workout = mapUser(userRecord)
    return workout
}

export default getUser
