import { supabase } from "@/lib/supabase/client"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"
import getDriverStandingsHistory from "@/lib/getDriverStandingsHistory"
import getMeetingHistory from "@/lib/getMeetingHistory"

export const revalidate = 900

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
        const [lastRaceSessionKey, driverStandingsHistory, meetingData] = await Promise.all([
            getLastRaceSessionKey(), getDriverStandingsHistory(), getMeetingHistory()
        ])

        if (!lastRaceSessionKey || !driverStandingsHistory || !meetingData){
            return Response.json(
                {success: false, error: "Error fetching from database"},
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

        // construct array of objects- each object has driverNo : pts and location: "..."
        const driverNums = [...new Set((driverStandingsHistory).map((standing:standingObj) => standing.driver_number))]
        const meetingKeys = [...new Set((driverStandingsHistory).map((standing:standingObj) => standing.meeting_key))]

        const meetingStartDate = (meetingKey: number): number => {
            const meeting = meetingData.find((m: meetingDataObj) => m.meeting_key === meetingKey)
            return meeting ? new Date(meeting.date_start).getTime() : 0
        }    
    
        meetingKeys.sort((a:number, b:number) => meetingStartDate(a) - meetingStartDate(b))

        const meetingLocation = (meetingKey:number) => meetingData.find((meeting:meetingDataObj) => meeting.meeting_key === meetingKey)?.location

        const validMeetingKeys = meetingKeys.filter((key:number) => meetingLocation(key))

    
        const standingsPerRaceGrouped = validMeetingKeys.map((key:number) => {
            const driversInRace = driverStandingsHistory.filter((standing:standingObj) => standing.meeting_key === key) 
            return driversInRace.reduce(
                (row: Record<string, number | string>, driver:standingObj) => {
                    row[driver.driver_number] = driver.points_current
                    return row
                }, {location: meetingLocation(key)}
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
