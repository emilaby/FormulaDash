import { supabaseAdmin } from "@/lib/supabase/server"
export async function GET() {
    try{
        const currentDate = new Date()
        
        const { data: lastSessionKey, error: lastSessionKeyErr } = await supabaseAdmin
            .from("sessions")
            .select("session_key")
            .lt("date_end", currentDate.toISOString())
            .order("date_end", { ascending: false })
            .limit(1)
        
        if (lastSessionKeyErr){
            console.error(lastSessionKeyErr.message)
            return Response.json(
                {success: false, error: lastSessionKeyErr.message},
                {status: 500}
            )
        }
        const lastSessionKeyParsed = lastSessionKey.map(lastSK => lastSK.session_key)[0]
        
        const { data: lastSession, error: lastSessionErr } = await supabaseAdmin
            .from("sessions")
            .select("*")
            .eq("session_key", lastSessionKeyParsed)
        
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


