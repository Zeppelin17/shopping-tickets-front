
export const POST = async ({ cookies, redirect, request }) => {
    // login form interaction with api
    try {
        const data = await request.formData()
        const username = data.get("username")
        const password = data.get("password")

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
        if (response.non_field_errors) {
            throw new Error(response.non_field_errors)
        }

        // response ok
        if (response.token) {
            const expires = new Date(response.expiry)

            cookies.set("token", response.token ,{
                httpOnly: true,
                sameSite: "strict",
                path: "/dashboard",
                expires
            })
            cookies.set("tokenExpiry", response.expiry, {
                httpOnly: true,
                sameSite: "strict",
                path: "/dashboard",
                expires
            })
            
            return redirect("/dashboard")
        }

    } catch (error) {
        console.error("Login failed", error)
        
        cookies.set("errorLogin", error ,{
            httpOnly: true,
            sameSite: "strict",
            path: "/login",
        })
        
        return redirect("/login")
    }
}