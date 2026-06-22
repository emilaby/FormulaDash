import { supabaseAdmin } from "@/lib/supabase/server"
type sessionDataElement = {
    position: number,
    driver_number: number,
    number_of_laps: number,
    points: number,
    dnf: boolean,
    dns: boolean,
    dsq: boolean,
    duration: number | number[],
    gap_to_leader: string | string[],
    meeting_key: number,
    session_key: number
}

export async function GET() {
    try{
        const sessionsUrl = "https://api.openf1.org/v1/session_result"
        const sessionsRes = await fetch(sessionsUrl)

        if (!sessionsRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const sessionsData = await sessionsRes.json()

        const parsedSessionsData = sessionsData.map((sessionData:sessionDataElement) => (
            {
                position: sessionData.position,
                driver_number: sessionData.driver_number,
                number_of_laps: sessionData.number_of_laps,
                points: sessionData.points,
                dnf: sessionData.dnf,
                dns: sessionData.dns,
                dsq: sessionData.dsq,
                duration: Array.isArray(sessionData.duration) ? sessionData.duration[sessionData.duration.length - 1] : sessionData.duration,
                gap_to_leader: Array.isArray(sessionData.gap_to_leader) ? sessionData.gap_to_leader[sessionData.gap_to_leader.length - 1] : sessionData.gap_to_leader,
                meeting_key: sessionData.meeting_key,
                session_key: sessionData.session_key
            }
        ))

        const { error } = await supabaseAdmin
            .from("session_results")
            .upsert(parsedSessionsData, {
                onConflict: "driver_number, session_key"
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
