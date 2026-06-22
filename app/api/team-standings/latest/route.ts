import { supabaseAdmin } from "@/lib/supabase/server"
import getLastRaceSessionKey from "@/lib/getLastRaceSessionKey"

export const revalidate = 900


type teamObj = {
    meeting_key: number,
    session_key: number,
    team_name: string,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number,
}

type teamNameColour = {
    team_name: string,
    team_colour: string
}


export async function GET(){


    try{
        const lastRaceSessionKey = await getLastRaceSessionKey()

        if (!lastRaceSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last race session key from database"},
                {status: 500}
            )
        }

        const { data: teamStandingsLatest, error: teamStandingsLatestErr } = await supabaseAdmin
            .from("team_standings")
            .select("*")
            .eq("session_key", lastRaceSessionKey)
        
        if (teamStandingsLatestErr){
            console.error(teamStandingsLatestErr.message)
            return Response.json(
                {success: false, error: teamStandingsLatestErr.message},
                {status: 500}
            )
        }

        const { data: teamNameColours, error: teamNameColoursErr } = await supabaseAdmin
            .from("drivers")
            .select("team_name, team_colour")
            .eq("session_key", lastRaceSessionKey)
        
        if (teamNameColoursErr){
            console.error(teamNameColoursErr.message)
            return Response.json(
                {success: false, error: teamNameColoursErr.message},
                {status: 500}
            )
        }

        const teamStandingsLatestMerged = teamStandingsLatest.map((teamStanding:teamObj) => {
            const teamColour = teamNameColours.find((teamNameColour:teamNameColour) => teamNameColour.team_name === teamStanding.team_name)?.team_colour
        
            return(
                {
                    meeting_key: teamStanding.meeting_key,
                    session_key: teamStanding.session_key,
                    team_name: teamStanding.team_name,
                    position_start: teamStanding.position_start,
                    position_current: teamStanding.position_current,
                    points_start: teamStanding.points_start,
                    points_current: teamStanding.points_current,
                    team_colour: teamColour
                }
            )
        })

        return Response.json(teamStandingsLatestMerged)

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
    )
    }
}
