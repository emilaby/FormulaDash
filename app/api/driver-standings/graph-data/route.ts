import { supabase } from "@/lib/supabase/client"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"
import getDriverStandingsHistory from "@/lib/getDriverStandingsHistory"
import getMeetingHistory from "@/lib/getMeetingHistory"

type standingObj = {
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

type meetingDataObj = {
    meeting_key: number,
    meeting_name: string,
    meeting_official_name: string,
    location: string,
    country_key: number,
    country_code: string,
    country_name: string,
    country_flag: string,
    circuit_key: number,
    circuit_short_name: string,
    circuit_type: string,
    circuit_info_url: string,
    circuit_image: string,
    gmt_offset: string,
    date_start: string,
    date_end: string,
    year: number,
    is_cancelled: boolean
}

export async function GET() {
    try{
        // get LATEST DRIVER DATA
        const lastRaceSessionKey = await getLastRaceSessionKey()

        if (!lastRaceSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last race session key"},
                {status: 500}
            )
        }
        const { data: driverLatest, error: driverLatestErr } = await supabase
                .from("drivers")
                .select("*")
                .eq("session_key", lastRaceSessionKey)
            
        if (driverLatestErr){
            console.error(driverLatestErr.message)
            return Response.json(
                {success: false, error: driverLatestErr.message},
                {status: 500}
            )
        }

        // get DRIVER STANDING FROM SEASON SO FAR
        const driverStandingsHistory = await getDriverStandingsHistory()
        if (!driverStandingsHistory){
            return Response.json(
                {success: false, error: "Error fetching driver standings from database"},
                {status: 500}
            )
        }

        // get MEETING DATA FROM SEASON SO FAR
        const meetingData = await getMeetingHistory()
        if (!meetingData){
            return Response.json(
                {success: false, error: "Error fetching meeting history from database"},
                {status: 500}
            )
        }

        // construct array of objects- each object has driverNo : pts and location: "..."

        const driverNumsSet = new Set((driverStandingsHistory??[]).map((standing:standingObj) => standing.driver_number))
        const driverNums = [...driverNumsSet]
    
    
        const meetingKeysSet = new Set((driverStandingsHistory??[]).map((standing:standingObj) => standing.meeting_key))
        const meetingKeys = [...meetingKeysSet]

        const meetingStartDate = (meetingKey: number): number => {
            const meeting = meetingData?.find((m: meetingDataObj) => m.meeting_key === meetingKey)
            return meeting ? new Date(meeting.date_start).getTime() : 0
        }    
    
        meetingKeys.sort((a:number, b:number) => meetingStartDate(a) - meetingStartDate(b))

        const meetingLocation = (meetingKey:number) => meetingData?.find((meeting:meetingDataObj) => meeting.meeting_key === meetingKey)?.location

    
        const standingsPerRaceGrouped = meetingKeys.map((key:number) => {
            const driversInRace = driverStandingsHistory?.filter((standing:standingObj) => standing.meeting_key === key) 
            return driversInRace?.reduce(
                (row: Record<string, number | string>, driver:standingObj) => {
                    row[driver.driver_number] = driver.points_current
                    return row
                }, {location: meetingLocation(key) || ""}
            )
        })


        return Response.json(
            {
                driverNums: driverNums,
                drivers: driverLatest,
                standingsPerRace: standingsPerRaceGrouped
            }
        )

    }
    catch(err){
        return Response.json(
            {success: false, error: err},
            {status: 500}
        )
    }
    
}
