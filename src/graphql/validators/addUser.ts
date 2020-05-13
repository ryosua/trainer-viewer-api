import { AuthenticationError } from 'apollo-server'

const validateAddUser = (secret: string) => {
    if (secret !== process.env.AUTH0_HOOK_SECRET) {
        console.log('secret', secret, 'AUTH0_HOOK_SECRET', process.env.AUTH0_HOOK_SECRET)

        throw new AuthenticationError('You do not have permission to do this.')
    }
}

export default validateAddUser
