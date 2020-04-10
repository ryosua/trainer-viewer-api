import { AuthenticationError } from 'apollo-server'

import User from '../types/User'
import addUser from '../../db/write/addUser'
import getUser from '../../db/read/getUser'

const authenticate = async (context: any): Promise<User> => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
    const user = (await getUser(email)) ?? (await addUser(email))
    return user
}

export default authenticate
