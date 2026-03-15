import { User } from "@supabase/supabase-js"
import { createClient } from "./server"

const isLoggedIn = async() => {
    const supabase = await createClient()
     const { data: user } = await supabase.auth.getUser()
     const currentUser = user.user as User
    if (currentUser ===null) {
         return null
     }

    return currentUser as User
}

export default isLoggedIn