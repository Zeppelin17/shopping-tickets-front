
export const POST = async ({ cookies, redirect, request }) => {
    try {
        const data = await request.formData()
        const id = data.get("id") === "false"   ? false : parseInt(data.get("id"))
        const name = data.get("name")
        
        let response
        if (id) {
            await updateShop(cookies, {id, name})
            return redirect(`/dashboard/editshop/${id}/`)
        }else{
            response = await createShop(cookies, {name})

            if (response.id) {
                return redirect(`/dashboard/editshop/${response.id}/`)
            } else {
                return redirect("/dashboard/newshop/")
            }
        }

    } catch (error) {
        console.error("Error", error)
        return redirect("/dashboard")
    }
    
    
}

const createShop = async (cookies, data) => {
    // new ticket form interaction with api
    try {
        const { name } = data

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
        if (response.non_field_errors) {
            throw new Error(response.non_field_errors)
        }
        
        // response ok
        if (response.id) {
            cookies.set("successShop", `Tienda ${response.name} creada`, {
                httpOnly: true,
                sameSite: "strict",
                path: `/dashboard/editshop/${response.id}/`,
            })
        }

        return response

    } catch (error) {
        console.error("New shop failed", error)
        
        cookies.set("errorShop", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: "/dashboard/newshop/",
        })
        
    }
}

const updateShop = async (cookies, data) => {
    // edit ticket form interaction with api
    try {
        const { id, name } = data

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
        if (response.non_field_errors) {
            throw new Error(response.non_field_errors)
        }

        // response ok
        if (response.id) {
            cookies.set("successShop", "Tienda editada", {
                httpOnly: true,
                sameSite: "strict",
                path: `/dashboard/editshop/${id}/`,
            })
        }

        return response

    } catch (error) {
        console.error("Edit shop failed", error)
        
        cookies.set("errorShop", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: `/dashboard/editshop/${id}/`,
        })
    }   
}