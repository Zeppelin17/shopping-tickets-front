import { getTickets, getShops } from "../../utils"

export const POST = async ({ cookies, redirect, request }) => {
    try {
        const data = await request.formData()

        const token = data.get("token")
        const year = parseInt(data.get("year"))
        const month = parseInt(data.get("month"))
        const shop = parseInt(data.get("shop"))
        
        await search(cookies, {token, year, month, shop})
        return redirect("/dashboard/searchticket/")

    } catch (error) {
        console.error("Error", error)
        return redirect("/dashboard/searchticket/")
    }
    
    
}

const search = async (cookies, data) => {
    // search tickets with given params
    try {
        const { token, year, month, shop } = data

        let response = await getTickets(token, {year, month})
        const shops = await getShops(token)

        response.forEach((ticket) => {
            ticket.shop = shops.find((shop) => shop.id === ticket.shop) || undefined
        })
        
        if (shop) {
            response = response.filter((ticket) => ticket.shop?.id === shop)
        }

        // response ok
        if (response) {
            cookies.set("resultSearch", `${JSON.stringify(response)}`, {
                httpOnly: true,
                sameSite: "strict",
                path: `/dashboard/searchticket/`,
            })
        }

        return response

    } catch (error) {
        console.error("New ticket failed", error)
        
        cookies.set("errorSearch", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: "/dashboard/searchticket/",
        })
        
    }
}