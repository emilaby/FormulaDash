export async function GET() {
    try{
        const latestSessionUrl = "https://api.openf1.org/v1/sessions?session_key=latest"
        const latestSessionRes = await fetch(latestSessionUrl, { next: {revalidate: 1000} })

        if (!latestSessionRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }

        let latestSessionData = await latestSessionRes.json()
        latestSessionData = latestSessionData[0] 
        const name = `${latestSessionData.location} ${latestSessionData.circuit_short_name} ${latestSessionData.session_name}`

        return Response.json(
            { 
                name : name,
                session_type: latestSessionData.session_type
            }
        )

    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


