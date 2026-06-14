import { TEAMNAMES, TEAMIMGS } from "@/public/data/f1Data"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"

export async function GET(){
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
        const lastRaceSessionKey = await getLastRaceSessionKey()
        if (!lastRaceSessionKey){
            return Response.json(
                {error: "Error fetching last session key from OpenF1"},
                {status: 502}
            )
        }
        
        const url = `https://api.openf1.org/v1/championship_teams?session_key=${lastRaceSessionKey}`

        const teamDataRes = await fetch(url, { next: {revalidate: 1000} })

        if (!teamDataRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
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
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}
