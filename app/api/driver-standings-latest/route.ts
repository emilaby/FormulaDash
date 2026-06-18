import { DRIVERNUMBERS, TEAMIMGS } from "@/public/data/f1Data"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"

export async function GET() {
    type championshipObj = {
        meeting_key: number,
        session_key: number,
        driver_number: number,
        position_start: number,
        position_current: number,
        points_start: number,
        points_current: number
    }
    
    type driverObj = {
        meeting_key: number,
        session_key: number,
        driver_number: number,
        broadcast_name: string,
        full_name: string,
        name_acronym: string,
        team_name: string,
        team_colour: string,
        first_name: string,
        last_name: string,
        headshot_url: string,
        country_code: string
    }

    try{
        const lastRaceSessionKey = await getLastRaceSessionKey()
        if (!lastRaceSessionKey){
            return Response.json(
                {error: "Error fetching last session key from OpenF1"},
                {status: 502}
            )
        }

        const baseUrl = "https://api.openf1.org/v1/"
        let championshipUrl = `${baseUrl}championship_drivers?session_key=${lastRaceSessionKey}`
        let driverDataUrl = `${baseUrl}drivers?session_key=${lastRaceSessionKey}`

        const [championshipRes, driverDataRes] = await Promise.all([fetch(championshipUrl, { next: {revalidate: 1000} }), 
                                                                        fetch(driverDataUrl, { next: {revalidate: 1000} })])

        if (!championshipRes.ok || !driverDataRes.ok){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }
        const[championshipData, driverData] = await Promise.all([championshipRes.json(), driverDataRes.json()])

        // creates array of merged objects from championshipData and driverData and adds team_img
        let mergedData = []
        for(const num of DRIVERNUMBERS){
            let championshipObj = championshipData.find((championshipDataObj:championshipObj) =>  championshipDataObj.driver_number === num)
            let driverObj = driverData.find((driverDataObj: driverObj) => driverDataObj.driver_number === num)
            const teamImg = TEAMIMGS.get(driverObj.team_name.toLowerCase().replace(/ /g, ""))
            mergedData.push({
                ...championshipObj,
                ...driverObj,
                team_img: teamImg
            })
        }

        return Response.json(mergedData)
    }

    catch(err){
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}