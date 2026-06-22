import { supabaseAdmin } from "@/lib/supabase/server"
import getLastSessionKey from "@/lib/getLastSessionKey"

export async function GET() {
    try{
        const lastSessionKey = await getLastSessionKey()

        if (!lastSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last session key from database"},
                {status: 500}
            )
        }
        
        const { data: lastSession, error: lastSessionErr } = await supabaseAdmin
            .from("sessions")
            .select("*")
            .eq("session_key", lastSessionKey)
        
        if (lastSessionErr){
            return Response.json(
                {success: false, error: lastSessionErr.message},
                {status: 500}
            )
        }

        const latestSessionData = lastSession[0]
        const name = `${latestSessionData.location} ${latestSessionData.circuit_short_name} ${latestSessionData.session_name}`

        return Response.json(
            { 
                name : name,
                session_type: latestSessionData.session_type
            }
        )

    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


