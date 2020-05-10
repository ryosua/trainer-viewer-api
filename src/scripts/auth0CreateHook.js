function create(user, url, secret) {
    const axios = require('axios')
    const email = user.email

    const payload = {
        query:
            'mutation AddUser( $email: String! $secret: String! ) { addUser( email: $email secret: $secret ) { id } }',
        variables: { email, secret }
    }

    axios({
        method: 'post',
        url: url,
        data: payload
    })
}

/**
  @param {object} user - The user being created
  @param {string} user.id - user id
  @param {string} user.tenant - Auth0 tenant name
  @param {string} user.username - user name
  @param {string} user.email - email
  @param {boolean} user.emailVerified - is e-mail verified?
  @param {string} user.phoneNumber - phone number
  @param {boolean} user.phoneNumberVerified - is phone number verified?
  @param {object} user.user_metadata - user metadata
  @param {object} user.app_metadata - application metadata
  @param {object} context - Auth0 connection and other context info
  @param {string} context.requestLanguage - language of the client agent
  @param {object} context.connection - information about the Auth0 connection
  @param {object} context.connection.id - connection id
  @param {object} context.connection.name - connection name
  @param {object} context.connection.tenant - connection tenant
  @param {object} context.webtask - webtask context
  @param {function} cb - function (error, response)
  */
module.exports = function (user, context, cb) {
    // create(user, cb, context.webtask.secrets.prod_url)
    create(user, context.webtask.secrets.test_url, context.webtask.secrets.auth0_hook_secret)
}
