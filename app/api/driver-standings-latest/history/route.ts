import { supabaseAdmin } from "@/lib/supabase/server"

type standingObj = {
    meeting_key: number,
    session_key: number,
    driver_number: number,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number
}

type meetingDataObj = {
    meeting_key: number,
    date_start: string,

}

export async function GET() {

    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const { data: meeting, error: meetingErr } = await supabaseAdmin
            .from("meetings")
            .select("meeting_key, date_start")
            .gt("date_start", startDate.toISOString())
            .lt("date_end", currentDate.toISOString())
        
        if (meetingErr){
            return Response.json(
                {success: false, error: meetingErr.message},
                {status: 500}
            )
        }

        const meetingKeysParsed = meeting?.map((m) => m.meeting_key)
        
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

        const driverStandingDateStart = (standing:standingObj) => meeting.find((m:meetingDataObj) => m.meeting_key === standing.meeting_key)?.date_start
        
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