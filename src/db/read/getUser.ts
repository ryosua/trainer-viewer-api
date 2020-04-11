import { QueryTypes } from 'sequelize'

import WorkoutRecord from '../types/WorkoutRecord'
import orm from '../../orm'
import mapUser from '../mappers/user'
import UserRecord from '../types/UserRecord'

const getUser = async (email: string) => {
    const [userRecord]: UserRecord[] = await orm.query('SELECT id FROM person where email = :email', {
        replacements: { email },
        type: QueryTypes.SELECT
    })
    if (userRecord) {
        const workout = mapUser(userRecord)
        return workout
    }
}

export default getUser
