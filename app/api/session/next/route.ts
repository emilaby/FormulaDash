export async function GET() {
    type sessionDataObj = {
        session_key: number,
        session_type: string,
        session_name: string, 
        date_start: string, 
        date_end: string,
        meeting_key: number,
        circuit_key: number,
        circuit_short_name: string,
        country_key: number,
        country_code: string,
        country_name: string,
        location: string,
        gmt_offset: string,
        year: number,
        is_cancelled: boolean

    }
    try{
        const sessionsUrl = "https://api.openf1.org/v1/sessions"
        const sessionsRes = await fetch(sessionsUrl, { next: {revalidate: 1000} })

        if (!sessionsRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }

        const sessionsData = await sessionsRes.json()
        // start date is after now, sort by date end, pick closest ending one
        const dateNow = new Date()
        const futureSessionsData = sessionsData.filter((sessionData:sessionDataObj) => new Date(sessionData.date_start) > dateNow)
        const sortedFutureSessionsData = futureSessionsData.sort((a:sessionDataObj, b:sessionDataObj) => a.date_end < b.date_end ? -1 : a.date_end > b.date_end ? 1 : 0)
        const nextSessionData = sortedFutureSessionsData[0]

        return Response.json(nextSessionData)
    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


