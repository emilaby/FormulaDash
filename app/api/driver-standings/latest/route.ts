import { DRIVERNUMBERS } from "@/public/data/f1Data"
import { supabaseAdmin } from "@/lib/supabase/server"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"

export async function GET() {
    type standingsObj = {
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
        // find last race session key from sessions
        // access all driver standings + drivers with that session key

        const lastRaceSessionKey = await getLastRaceSessionKey()

        if (!lastRaceSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last race session key from database"},
                {status: 500}
            )
        }

        const { data: driverStandings, error: driverStandingsErr } = await supabaseAdmin
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

        const { data: driverData, error: driverDataErr } = await supabaseAdmin
            .from("drivers")
            .select("*")
            .eq("session_key", lastRaceSessionKey)

        
        if (driverDataErr){
            console.error(driverDataErr.message)

            return Response.json(
                {success: false, error: driverDataErr.message},
                {status: 500}
            )
        }

        let mergedData = []
        for(const num of DRIVERNUMBERS){
            let driverStanding = driverStandings.find((standing:standingsObj) =>  standing.driver_number === num)
            let driverObj = driverData.find((driverDataObj: driverObj) => driverDataObj.driver_number === num)
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