import { supabase } from "@/lib/supabase/client"

import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"
import { DriverStanding, Driver } from "@/types"

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

        const { data: driverStandings, error: driverStandingsErr } = await supabase
            .from("driver_standings")
            .select("*")
            .eq("session_key", lastRaceSessionKey)


        if (driverStandingsErr){
            console.error(driverStandingsErr.message)
            return Response.json(
                {success: false, error: driverStandingsErr.message},
                {status: 500}
            )
        }

        const driverNums = [...new Set((driverStandings).map((standing:DriverStanding) => standing.driver_number))]
 
        const { data: driverData, error: driverDataErr } = await supabase.rpc("get_latest_drivers", {
            driver_nums: driverNums
        })

        if (driverDataErr){
            console.error(driverDataErr.message)
            return Response.json(
                {success: false, error: driverDataErr.message},
                {status: 500}
            )
        }

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