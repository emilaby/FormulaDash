import { supabase } from "./supabase/client"
export default async function getLastRaceSessionKey(){
    try{
        const currentDate = new Date()

        const { data: lastRaceSessionKey, error: lastRaceSessionKeyErr } = await supabase
            .from("sessions")
            .select("session_key")
            .lt("date_end", currentDate.toISOString())
            .eq("session_type", "Race")
            .order("date_end", { ascending: false })
            .limit(1)
        
        if (lastRaceSessionKeyErr){
            return null
        }
        const lastRaceSessionKeyParsed = lastRaceSessionKey.map(lastRaceSK => lastRaceSK.session_key)[0]

        return lastRaceSessionKeyParsed

    }

    catch(err){
        console.error(err)
        return null
    
    }
}

