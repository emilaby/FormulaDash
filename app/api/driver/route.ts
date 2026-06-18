export async function GET() {
    try{
        const driverDataUrl = "https://api.openf1.org/v1/drivers?session_key=latest"
        const driverDataRes = await fetch(driverDataUrl, { next: {revalidate: 1000} })

        if (!driverDataRes.ok){
            return Response.json(
                {error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const driverData = await driverDataRes.json()

        return Response.json(driverData)
    }
catch{
    return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}
