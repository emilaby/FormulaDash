import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(){
    try{
        const currentDate = new Date()

        const { data: lastRaceSessionKey, error: lastRaceSessionKeyErr } = await supabaseAdmin
            .from("sessions")
            .select("session_key")
            .lt("date_end", currentDate.toISOString())
            .eq("session_type", "Race")
            .order("date_end", { ascending: false })
            .limit(1)
        
        if (lastRaceSessionKeyErr){
            console.error(lastRaceSessionKeyErr.message)
            return Response.json(
                {success: false, error: lastRaceSessionKeyErr.message},
                {status: 500}
            )
        }
        const lastRaceSessionKeyParsed = lastRaceSessionKey.map(lastRaceSK => lastRaceSK.session_key)[0]

        const { data: driverLatest, error: driverLatestErr } = await supabaseAdmin
            .from("drivers")
            .select("*")
            .eq("session_key", lastRaceSessionKeyParsed)
        
        if (driverLatestErr){
            console.error(driverLatestErr.message)
            return Response.json(
                {success: false, error: driverLatestErr.message},
                {status: 500}
            )
        }

        return Response.json(driverLatest)

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
    )
    }
}
