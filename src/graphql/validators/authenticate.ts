import { AuthenticationError } from 'apollo-server'

const authenticate = async (context: any) => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
}

export default authenticate
