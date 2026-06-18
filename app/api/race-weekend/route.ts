import getCurrentMeetingKey from "@/lib/getCurrentMeetingKey"

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

            const latestMeetingUrl = `https://api.openf1.org/v1/meetings?meeting_key=${meetingKey}`
            const latestMeetingRes = await fetch(latestMeetingUrl, { next: {revalidate: 1000} })
            
            if (!latestMeetingRes.ok){
                return Response.json(
                    {error: "Error fetching latest meeting data from OpenF1"},
                    {status: 502}
                )
            }
            
            const latestMeetingData = await latestMeetingRes.json()
            return Response.json(latestMeetingData[0])
        }


        const meetingsUrl = `https://api.openf1.org/v1/meetings?meeting_key=${meetingKeys.join("&meeting_key=")}`
        const meetingsRes = await fetch(meetingsUrl, { next: {revalidate: 1000} })

        if (!meetingsRes.ok){
            return Response.json(
                {error: "Error fetching meeting data from OpenF1"},
                {status: 502}
            )
        }
        const meetingData = await meetingsRes.json()
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
