import getCurrentMeetingKey from "@/lib/getCurrentMeetingKey"
import getMeetings from "@/lib/getMeetings"

export async function GET(request: Request) {
    try{
        const { searchParams } = new URL(request.url)
        const meetingKeys = searchParams.getAll("meeting_key")

        if (meetingKeys.length === 0){
            const meetingKey = await getCurrentMeetingKey()
            if (!meetingKey){
                return Response.json(
                    {error: "Error fetching current meeting key from OpenF1"},
                    {status: 502}
                )
            }

            const latestMeetingData = await getMeetings(`meeting_key=${meetingKey}`)
            
            if (!latestMeetingData){
                return Response.json(
                    {error: "Error fetching latest meeting data from OpenF1"},
                    {status: 502}
                )
            }
            
            return Response.json(latestMeetingData[0])
        }

        const meetingData = await getMeetings(`meeting_key=${meetingKeys.join("&meeting_key=")}`)

        if (!meetingData){
            return Response.json(
                {error: "Error fetching meeting data from OpenF1"},
                {status: 502}
            )
        }
        
        return Response.json(meetingData)

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}
