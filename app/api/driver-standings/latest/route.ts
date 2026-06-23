import { supabase } from "@/lib/supabase/client"

import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"
import { DriverStanding, Driver } from "@/types"

export const revalidate = 900

// Returns latest driver standings merged with driver data
export async function GET() {
    try{
        const lastRaceSessionKey = await getLastRaceSessionKey()

        if (!lastRaceSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last race session key from database"},
                {status: 500}
            )
        }

        const [{ data: driverStandings, error: driverStandingsErr }, { data: driverData, error: driverDataErr }] = await Promise.all([
            supabase.from("driver_standings").select("*").eq("session_key", lastRaceSessionKey),
            supabase.from("drivers").select("*").eq("session_key", lastRaceSessionKey)

        ])

        if (driverStandingsErr){
            console.error(driverStandingsErr.message)
            return Response.json(
                {success: false, error: driverStandingsErr.message},
                {status: 500}
            )
        }
        
        if (driverDataErr){
            console.error(driverDataErr.message)
            return Response.json(
                {success: false, error: driverDataErr.message},
                {status: 500}
            )
        }

        const driverNums = [...new Set((driverStandings).map((standing:DriverStanding) => standing.driver_number))]

        const mergedData = []
        for(const num of driverNums){
            const driverStanding = driverStandings.find((standing:DriverStanding) =>  standing.driver_number === num)
            const driverObj = driverData.find((driverDataObj:Driver) => driverDataObj.driver_number === num)
            mergedData.push({
                ...driverStanding,
                ...driverObj,
            })
        }

        return Response.json(mergedData)
    }

    catch(err){
        console.error(err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
    )
    }
}