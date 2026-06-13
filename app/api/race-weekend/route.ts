export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }){
    try{
        const latestMeetingUrl = "https://api.openf1.org/v1/meetings?meeting_key=latest"

        const latestMeetingRes = await fetch(latestMeetingUrl, { next: {revalidate: 1000} })

        if (!latestMeetingRes.ok){
            console.log("LATEST MEETING NO OK")
            console.log(latestMeetingUrl)
            console.log(latestMeetingRes.status)
            return Response.json(
                {error: "FastF1 error"},
                {status: 502}
            )
        }
        
        const latestMeetingData = await latestMeetingRes.json()
        const dateEnd = latestMeetingData[0].date_end

        // if latest meeting already finished fetch and return next, otherwise return latest
        if (Date.parse(dateEnd) > Date.now()){
            return Response.json(latestMeetingData[0])
        }
        const nextMeetingKey = latestMeetingData[0].meeting_key + 1
        const nextMeetingUrl = `https://api.openf1.org/v1/meetings?meeting_key=${nextMeetingKey}`
        const nextMeetingRes = await fetch(nextMeetingUrl)

        if (!nextMeetingRes.ok){
            console.log("NEXT MEETING NO OK")

            return Response.json(
                {error: `FastF1 error`},
                {status: 502}
            )
        }
        
        const nextMeetingData = await nextMeetingRes.json()
        return Response.json(nextMeetingData[0])       

    }

    catch(err){
        console.error("Error fetching from FastF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}
