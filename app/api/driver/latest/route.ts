import { supabaseAdmin } from "@/lib/supabase/server"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"

export async function GET(){
    try{
        const lastRaceSessionKey = await getLastRaceSessionKey()

        if (!lastRaceSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last race session key from database"},
                {status: 500}
            )
        }

        const { data: driverLatest, error: driverLatestErr } = await supabaseAdmin
            .from("drivers")
            .select("*")
            .eq("session_key", lastRaceSessionKey)
        
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
