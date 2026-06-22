import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(){
    type teamObj = {
        meeting_key: number,
        session_key: number,
        team_name: string,
        position_start: number,
        position_current: number,
        points_start: number,
        points_current: number,
    }

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

        const { data: teamStandingsLatest, error: teamStandingsLatestErr } = await supabaseAdmin
            .from("team_standings")
            .select("*")
            .eq("session_key", lastRaceSessionKeyParsed)
        
        if (teamStandingsLatestErr){
            console.error(teamStandingsLatestErr.message)
            return Response.json(
                {success: false, error: teamStandingsLatestErr.message},
                {status: 500}
            )
        }

        return Response.json(teamStandingsLatest)

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
    )
    }
}
