import { supabase } from "@/lib/supabase/client"

export const revalidate = 450

// Returns current/next race's meeting data.
export async function GET() {
    try{

        const currentDate = new Date()

        const { data: meetingData, error: meetingDataErr } = await supabase
            .from("meetings")
            .select("*")
            .gt("date_end", currentDate.toISOString())
            .order("date_end", { ascending: true })
            .limit(1)
        
        if (meetingDataErr){
            return Response.json(
                {success: false, error: meetingDataErr.message},
                {status: 500}
            )
        }

        const currMeetingData = meetingData[0]
        const meetingKey = currMeetingData.meeting_key

        const { data: meetingSessionsData, error: meetingSessionsDataErr } = await supabase
            .from("sessions")
            .select("session_name, date_start")
            .eq("meeting_key", meetingKey)
            .gt("date_end", currentDate.toISOString())
            .order("date_end", { ascending: true })
            
        
        if (meetingSessionsDataErr){
            return Response.json(
                {success: false, error: meetingSessionsDataErr.message},
                {status: 500}
            )
        }
        
        return Response.json(
            {
                meetingData: currMeetingData,
                sessions: meetingSessionsData
            }
        )

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}
