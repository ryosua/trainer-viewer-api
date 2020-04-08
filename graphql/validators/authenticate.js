const authenticate = async (context) => {
    const email = await context.user
    if (!email) {
        throw new AuthenticationError('You must be logged in to do this')
    }
}

module.exports = authenticate
