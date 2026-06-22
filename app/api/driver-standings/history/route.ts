import getMeetingHistory from "@/lib/getMeetingHistory"

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
        const meetingHistory = await getMeetingHistory()

        if (!meetingHistory){
            return Response.json(
                {error: "Failed to get meeting history"},
                {status: 500}
            )
        }
        
        return Response.json(meetingHistory)            
    }
        

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}