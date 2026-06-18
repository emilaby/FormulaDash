export async function GET() {
    try{
        const latestSessionUrl = "https://api.openf1.org/v1/session_result?session_key=latest"
        const latestSessionRes = await fetch(latestSessionUrl, { next: {revalidate: 1000} })

        if (!latestSessionRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }

        const latestSessionData = await latestSessionRes.json()

        return Response.json(latestSessionData)

    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


