
export const POST = async ({ cookies, redirect, request }) => {
    // new ticket form interaction with api
    try {
        const data = await request.formData()
        const date = data.get("date")
        const amount = data.get("amount")
        const shop = data.get("shop")

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
            cookies.set("successTicket", "Ticket creado", {
                httpOnly: true,
                sameSite: "strict",
                path: "/dashboard/newticket",
            })
            
            return redirect("/dashboard/newticket")
        }

    } catch (error) {
        console.error("New ticket failed", error)
        
        cookies.set("errorTicket", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: "/dashboard/newticket",
        })
        
        return redirect("/dashboard/newticket")
    }
}