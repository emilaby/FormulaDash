import { supabaseAdmin } from "@/lib/supabase/server"
import { Session } from "@/types"

export async function GET() {
    try{
        const sessionsUrl = "https://api.openf1.org/v1/sessions"
        const sessionsRes = await fetch(sessionsUrl)

        if (!sessionsRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const sessionsData: Session[] = await sessionsRes.json()

        const { error } = await supabaseAdmin
            .from("sessions")
            .upsert(sessionsData, {
                onConflict: "session_key"
        })

        if (error){
            console.error(error.message)
            return Response.json(
                {success: false, error: error.message},
                {status: 500})
        }

        return Response.json({success: true})
    }
    
    catch(err){
        console.error(err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
        )
    }
}
