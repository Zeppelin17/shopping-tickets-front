/**
 * Checks if the user is currently logged in based on the token and its expiry.
 *
 * @param {object} config - The configuration object containing the user "token" and its "tokenExpiry".
 * @return {boolean} Whether the user is currently logged in or not.
 */
const isLoggedIn = (config) => {
    if (config.token && config.tokenExpiry) {
        const now = new Date()
        const expiry = new Date(config.tokenExpiry)
        return now < expiry
    }

    return false
}

export { isLoggedIn }