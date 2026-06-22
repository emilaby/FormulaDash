import getLastSession from "@/lib/getLastSession"

export async function GET() {
    try{
        const lastSession = await getLastSession()
        if (!lastSession){
            return Response.json(
                {error: "Failed to load data"},
                {status: 500}
            )
        }

        return Response.json(lastSession)

    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


