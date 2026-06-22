import { supabase } from "./supabase/client"

export default async function getLastSessionKey(){

    try{
        const currentDate = new Date()
                
        const { data: lastSessionKey, error: lastSessionKeyErr } = await supabase
            .from("sessions")
            .select("session_key")
            .lt("date_end", currentDate.toISOString())
            .order("date_end", { ascending: false })
            .limit(1)
        
        if (lastSessionKeyErr){
            return null
        }

        const lastSessionKeyParsed = lastSessionKey.map(lastSK => lastSK.session_key)[0]

        return lastSessionKeyParsed
    }

    catch(err){
        return null
    
    }
}