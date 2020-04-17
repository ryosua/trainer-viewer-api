import { QueryTypes } from 'sequelize'

import orm from '../../orm'
import mapUser from '../mappers/user'
import UserRecord from '../types/UserRecord'
import User from '../../graphql/types/User'

const getUser = async (email: string): Promise<User | undefined> => {
    const [userRecord]: UserRecord[] = await orm.query(
        'SELECT id, date_user_agreement_signed FROM person where email = :email',
        {
            replacements: { email },
            type: QueryTypes.SELECT
        }
    )
    if (userRecord) {
        const workout = mapUser(userRecord)
        return workout
    }
}

export default getUser
