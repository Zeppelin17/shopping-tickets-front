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

/**
 * Logs in a user with the given username and password.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @return {Object} Response object from the login endpoint.
 */
const loginUser = async (username, password) => {
    const loginEndoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/login"
        const query = await fetch(loginEndoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const response = await query.json()
        return response
}

/**
 * Retrieves a list of shops from the API.
 *
 * @param {string} token - The authentication token for the API.
 * @return {Array<Object>} Array of shop objects.
 */
const getShops = async (token) => {
    const shopsEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/shops"
    const query = await fetch(shopsEndpoint, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const response = await query.json()
    return response
}

/**
 * Retrieves a specific shop from the API based on the provided ID.
 *
 * @param {string} token - The authentication token for the API.
 * @param {string} id - The ID of the shop to be retrieved.
 * @return {Object} The shop object retrieved from the API.
 */
const getShop = async (token, id) => {
    const shopsEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/shops/" + id + "/"
    const query = await fetch(shopsEndpoint, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const response = await query.json()
    return response
}

/**
 * Updates a shop by sending a PUT request to the API endpoint.
 *
 * @param {number} id - The ID of the shop to be updated.
 * @param {string} name - The updated name of the shop.
 * @return {Object} The updated shop object returned from the API.
 */
const putShop = async (id, name) => {
    const updateShopEndoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/shops/" + id + "/"
        const query = await fetch(updateShopEndoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name
            })
        })
        const response = await query.json()
        return response
}

/**
 * Creates a new shop by sending a POST request to the API endpoint.
 *
 * @param {string} name - The name of the shop.
 * @return {Object} The response object from the API.
 */
const postShop = async (name) => {
    const createShopEndoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/shops/"
        const query = await fetch(createShopEndoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name
            })
        })
        const response = await query.json()
        return response
}

/**
 * Deletes a shop from the API.
 *
 * @param {string} token - The authentication token for the API.
 * @param {number} id - The ID of the shop to be deleted.
 * @return {number} The HTTP status code of the deletion request.
 */
const deleteShop = async (token, id) => {
    const shopEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/shops/" + id + "/"
    const query = await fetch(shopEndpoint, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const status = query.status
    return status
}

/**
 * Sorts the tickets by date in either ascending or descending order.
 *
 * @param {Array<Object>} tickets - The array of ticket objects to be sorted.
 * @param {string} [sort="desc"] - The sorting order, either "asc" for ascending or "desc" for descending.
 * @return {Array<Object>} The sorted array of ticket objects.
 */
const sortTicketsByDate = (tickets, sort = "desc") => {
    
    // sort tickets in ascending order or descending depending on param sort
    if (sort === "asc") {
        tickets.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sort === "desc") {
        tickets.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return tickets
}

/**
 * Retrieves the tickets for the current month from the API.
 *
 * @param {string} token - The authentication token for the API.
 * @return {Array<Object>} Array of ticket objects.
 */
const getTickets = async (token, params = {}) => {
    const {year=undefined, month=undefined} = params

    let queryParams = "?"
    queryParams += year ? `&year=${year}` : `&year=${0}`
    queryParams += month ? `&month=${month}` : `&month=${0}`

    
    const ticketsEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/tickets/" + queryParams
    const query = await fetch(ticketsEndpoint, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const response = await query.json()    
    return sortTicketsByDate(response)
}

/**
 * Retrieves a specific ticket from the API based on the provided token and ID.
 *
 * @param {string} token - The authentication token for the API.
 * @param {string} id - The ID of the ticket to be retrieved.
 * @return {Object} The ticket object retrieved from the API.
 */
const getTicket = async (token, id) => {
    const ticketEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/tickets/" + id
    const query = await fetch(ticketEndpoint, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const response = await query.json()
    return response
}

/**
 * Updates a ticket by sending a PUT request to the API endpoint.
 *
 * @param {number} id - The ID of the ticket to be updated.
 * @param {string} date - The updated date of the ticket.
 * @param {number} amount - The updated amount of the ticket.
 * @param {number} shop - The updated shop associated with the ticket.
 * @return {Object} The updated ticket returned from the API.
 */
const putTicket = async (id, date, amount, shop) => {
    const updateTicketEndoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/tickets/" + id + "/"
        const query = await fetch(updateTicketEndoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date,
                amount,
                shop
            })
        })
        const response = await query.json()
        return response
}

/**
 * Creates a new ticket by sending a POST request to the API endpoint.
 *
 * @param {string} date - The date of the ticket.
 * @param {number} amount - The amount of the ticket.
 * @param {number} shop - The shop associated with the ticket.
 * @return {Object} New ticket created and returnet from the API
 */
const postTicket = async (date, amount, shop) => {
    const createTicketEndoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/tickets/"
        const query = await fetch(createTicketEndoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date,
                amount,
                shop
            })
        })
        const response = await query.json()
        return response
}

/**
 * Deletes a ticket from the API.
 *
 * @param {string} token - The authentication token for the API.
 * @param {number} id - The ID of the ticket to be deleted.
 * @return {number} The HTTP status code of the deletion request.
 */
const deleteTicket = async (token, id) => {
    const ticketEndpoint = import.meta.env.BASE_API_URL + import.meta.env.API_VERSION + "/tickets/" + id + "/"
    const query = await fetch(ticketEndpoint, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    const status = query.status
    return status
}

export { 
    isLoggedIn, 
    getShops, 
    getShop,
    putShop,
    postShop,
    deleteShop,
    getTickets,
    getTicket,
    putTicket,
    postTicket,
    deleteTicket,
    loginUser 
}