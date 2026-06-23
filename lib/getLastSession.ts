import { supabase } from "./supabase/client"
import getLastSessionKey from "./getLastSessionKey"

// Returns last session data.
export default async function getLastSession() {
    try{
        const lastSessionKey = await getLastSessionKey()

        if (!lastSessionKey){
            return null
        }
        
        const { data: lastSession, error: lastSessionErr } = await supabase
            .from("sessions")
            .select("*")
            .eq("session_key", lastSessionKey)
        
        if (lastSessionErr){
            return null
        }

        const latestSessionData = lastSession[0]
        const name = `${latestSessionData.location} ${latestSessionData.circuit_short_name} ${latestSessionData.session_name}`

        return (
            { 
                name : name,
                session_type: latestSessionData.session_type
            }
        )

    }

    catch(err) {
        return null
    }
}


