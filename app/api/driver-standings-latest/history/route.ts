import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {

    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const { data: meetingKeys, error: meetingKeysErr } = await supabaseAdmin
            .from("meetings")
            .select("meeting_key")
            .gt("date_start", startDate.toISOString())
            .lt("date_end", currentDate.toISOString())
        
        if (meetingKeysErr){
            return Response.json(
                {success: false, error: meetingKeysErr.message},
                {status: 500}
            )
        }

        const meetingKeysParsed = meetingKeys?.map((m) => m.meeting_key)
        
        const { data: driverStandings, error: driverStandingsErr} = await supabaseAdmin
            .from("driver_standings")
            .select("*")
            .in("meeting_key", meetingKeysParsed)
        
        if (driverStandingsErr){
            return Response.json(
                {success: false, error: driverStandingsErr.message},
                {status: 500}
            )
        }
        
        return Response.json(driverStandings)            
    }
        

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}