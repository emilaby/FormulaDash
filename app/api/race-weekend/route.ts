import getCurrentMeetingKey from "@/lib/getCurrentMeetingKey"

export async function GET() {
    try{
        const meetingKey = await getCurrentMeetingKey()
        if (!meetingKey){
            return Response.json(
                {error: "Error fetching current meeting key from OpenF1"},
                {status: 502}
            )
        }

        const latestMeetingUrl = `https://api.openf1.org/v1/meetings?meeting_key=${meetingKey}`

        const latestMeetingRes = await fetch(latestMeetingUrl, { next: {revalidate: 1000} })

        if (!latestMeetingRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }
        
        const latestMeetingData = await latestMeetingRes.json()

        return Response.json(latestMeetingData[0])
    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}
