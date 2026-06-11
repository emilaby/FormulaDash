import { DRIVERNUMBERS } from "@/data/driverNumbers"

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }){

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

    const { searchParams } = new URL(request.url)
    const driverNums = searchParams.getAll("driver_number")
    try{
        if (driverNums.length <= 0){
            return Response.json(
                {error: "No driver number specified"},
                {status: 400}
            )
        }
        const baseUrl = "https://api.openf1.org/v1/"
        let championshipUrl = `${baseUrl}championship_drivers?session_key=latest`
        let driverDataUrl = `${baseUrl}drivers?session_key=latest`

        let driverQueryParams =[]
        
        for (const num of driverNums){
            const driverNum = parseInt(num)
            if(!DRIVERNUMBERS.includes(driverNum)){
                return Response.json(
                    {error: "Invalid driver number(s)"},
                    {status: 400}
                )
            }
            driverQueryParams.push(`&driver_number=${driverNum}`)
        }

        championshipUrl = `${championshipUrl}${driverQueryParams.join("")}`
        driverDataUrl = `${driverDataUrl}${driverQueryParams.join("")}`

        const [championshipRes, driverDataRes] = await Promise.all([fetch(championshipUrl), fetch(driverDataUrl)])

        if (!championshipRes.ok || !driverDataRes.ok){
            return Response.json(
                {error: "FastF1 error"},
                {status: 502}
            )
        }
        const[championshipData, driverData] = await Promise.all([championshipRes.json(), driverDataRes.json()])

        //remove duplicate objects in driverData
        const uniqueDriverData = driverData.filter(
            (driver:driverObj, index:number, arr:driverObj[]) => index === arr.findIndex(dr => dr.full_name === driver.full_name)
        )

        let mergedData = []
        for(const num of DRIVERNUMBERS){
            let championshipObj = championshipData.find((championshipDataObj:championshipObj) =>  championshipDataObj.driver_number === num)
            let driverObj = uniqueDriverData.find((driverDataObj: driverObj) => driverDataObj.driver_number === num)
            mergedData.push({
                ...championshipObj,
                ...driverObj
            })
        }

        return Response.json(
            mergedData
        )
    }

    catch(err){
        console.error("Error fetching from FastF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}
