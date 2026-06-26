import { supabase } from "@/lib/supabase/client"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"
import getDriverStandingsHistory from "@/lib/getDriverStandingsHistory"
import getMeetingHistory from "@/lib/getMeetingHistory"

import { DriverStanding, Meeting } from "@/types"

export const revalidate = 450

// Returns driver numbers (of current drivers), 
// driver data (of current drivers), 
// driver standings grouped by race from current season so far (only for current drivers).
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
        const driverNums = [...new Set((driverStandingsHistory).map((standing:DriverStanding) => standing.driver_number))]
        const meetingKeys = [...new Set((driverStandingsHistory).map((standing:DriverStanding) => standing.meeting_key))]

        const meetingStartDate = (meetingKey: number): number => {
            const meeting = meetingData.find((m: Meeting) => m.meeting_key === meetingKey)
            return meeting ? new Date(meeting.date_start).getTime() : 0
        }    
    
        meetingKeys.sort((a:number, b:number) => meetingStartDate(a) - meetingStartDate(b))

        const meetingLocation = (meetingKey:number) => meetingData.find((meeting:Meeting) => meeting.meeting_key === meetingKey)?.location

        const validMeetingKeys = meetingKeys.filter((key:number) => meetingLocation(key))

    
        const standingsPerRaceGrouped: Record<string, number | string>[] = validMeetingKeys.map((key:number) => {
            const driversInRace = driverStandingsHistory.filter((standing:DriverStanding) => standing.meeting_key === key) 
            return driversInRace.reduce(
                (row: Record<string, number | string>, driver:DriverStanding) => {
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
