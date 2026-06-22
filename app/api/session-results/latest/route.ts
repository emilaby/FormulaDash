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


        const { data: latestSessionResult, error: latestSessionResultErr } = await supabaseAdmin
            .from("session_results")
            .select("*")
            .eq("session_key", lastSessionKeyParsed)
        
        if (latestSessionResultErr){
            console.error(latestSessionResultErr.message)
            return Response.json(
                {success: false, error: latestSessionResultErr.message},
                {status: 500}
            )
        }

        return Response.json(latestSessionResult)

    }

    catch(err) {
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
        )
    }
}


