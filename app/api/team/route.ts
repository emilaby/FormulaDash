import { TEAMNAMES, TEAMIMGS } from "@/public/data/f1Data"
//https://api.openf1.org/v1/championship_teams?session_key=latest&team_name=Audi&team_name=Mercedes

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }){
    const { searchParams } = new URL(request.url)
    const teamNames = searchParams.getAll("team_name")
    type teamObj = {
        meeting_key: number,
        session_key: number,
        team_name: string,
        position_start: number,
        position_current: number,
        points_start: number,
        points_current: number,
    }

    try{
        if (teamNames.length <= 0){
            return Response.json(
                {error: "No team specified"},
                {status: 400}
            )
        }

        let teamQueryParams =[]
        
        for (const name of teamNames){
            if(!TEAMNAMES.includes(name)){
                return Response.json(
                    {error: "Invalid team name(s)"},
                    {status: 400}
                )
            }
            teamQueryParams.push(`&team_name=${name}`)
        }

        const url = `https://api.openf1.org/v1/championship_teams?session_key=latest${teamQueryParams.join("")}`

        const teamDataRes = await fetch(url)

        if (!teamDataRes.ok){
            return Response.json(
                {error: "FastF1 error"},
                {status: 502}
            )
        }
        
        const teamData = await teamDataRes.json()
        let mergedData = []

        for (const name of TEAMNAMES){
            const teamObj = teamData.find((teamDataObj:teamObj) => teamDataObj.team_name === name)
            const teamImg = TEAMIMGS.get(teamObj.team_name.toLowerCase().replace(/ /g, ""))
            mergedData.push({
                ...teamObj,
                team_img: teamImg
            })

        }
        

        return Response.json(mergedData)
    }

    catch(err){
        console.error("Error fetching from FastF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}
