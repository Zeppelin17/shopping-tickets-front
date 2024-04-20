
export const POST = async ({ cookies, redirect, request }) => {
    try {
        const data = await request.formData()
        const id = data.get("id") === "false"   ? false : parseInt(data.get("id"))
        const date = data.get("date")
        const amount = data.get("amount")
        const shop = data.get("shop")
        
        let response
        if (id) {
            await updateTicket(cookies, {id, date, amount, shop})
            return redirect(`/dashboard/editticket/${id}/`)
        }else{
            response = await createTicket(cookies, {date, amount, shop})

            if (response.id) {
                return redirect(`/dashboard/editticket/${response.id}/`)
            } else {
                return redirect("/dashboard/newticket/")
            }
        }

    } catch (error) {
        console.error("Error", error)
        return redirect("/dashboard")
    }
    
    
}

const createTicket = async (cookies, data) => {
    // new ticket form interaction with api
    try {
        const { date, amount, shop } = data

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
        if (response.non_field_errors) {
            throw new Error(response.non_field_errors)
        }
        
        // response ok
        if (response.id) {
            cookies.set("successTicket", `Ticket ${response.id} creado`, {
                httpOnly: true,
                sameSite: "strict",
                path: `/dashboard/editticket/${response.id}/`,
            })
        }

        return response

    } catch (error) {
        console.error("New ticket failed", error)
        
        cookies.set("errorTicket", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: "/dashboard/newticket/",
        })
        
    }
}

const updateTicket = async (cookies, data) => {
    // edit ticket form interaction with api
    try {
        const { id, date, amount, shop } = data

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
        if (response.non_field_errors) {
            throw new Error(response.non_field_errors)
        }

        // response ok
        if (response.id) {
            cookies.set("successTicket", "Ticket editado", {
                httpOnly: true,
                sameSite: "strict",
                path: `/dashboard/editticket/${id}/`,
            })
        }

        return response

    } catch (error) {
        console.error("Edit ticket failed", error)
        
        cookies.set("errorTicket", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: `/dashboard/editticket/${id}/`,
        })
    }   
}