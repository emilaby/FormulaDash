import { supabase } from "./supabase/client"
export default async function getDriverStandingsHistory() {
    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const { data: meeting, error: meetingErr } = await supabase
            .from("meetings")
            .select("meeting_key, date_start")
            .gt("date_start", startDate.toISOString())
            .lt("date_end", currentDate.toISOString())
        
        if (meetingErr){
            return null
        }

        const meetingKeysParsed = meeting?.map((m) => m.meeting_key)
        
        const { data: driverStandings, error: driverStandingsErr} = await supabase
            .from("driver_standings")
            .select("*")
            .in("meeting_key", meetingKeysParsed)
        
        if (driverStandingsErr){
            return null
        }

        return driverStandings
    }

    catch(err){
        return null
    }
    
}