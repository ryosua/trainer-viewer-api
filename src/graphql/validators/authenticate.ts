import { AuthenticationError } from 'apollo-server'

import { User } from '../../shared'
import getUser from '../../db/read/getUser'

const authenticate = async (context: any): Promise<User> => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this.')
    }
    const user = await getUser(email)
    if (!user) {
        throw new AuthenticationError('No user exists for that email.')
    }
    return user
}

export default authenticate
