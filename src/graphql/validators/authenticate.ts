const { AuthenticationError } = require('apollo-server')

const authenticate = async (context: any) => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
}

module.exports = authenticate
