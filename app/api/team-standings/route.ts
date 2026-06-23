import { supabaseAdmin } from "@/lib/supabase/server"
import { TeamStanding } from "@/types"
import { NextRequest } from "next/server"
import authCheck from "@/lib/authCheck"

// Updates team_standings table with team standing data from OpenF1
export async function GET(req:NextRequest) {
    try{
        const authorised = authCheck(req)

        if (!authorised){
            return Response.json(
                {success: false, error: "Unauthorised"},
                {status: 401}
            )
        }

        const teamStandingsUrl = "https://api.openf1.org/v1/championship_teams"
        const teamStandingsRes = await fetch(teamStandingsUrl)

        if (!teamStandingsRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const teamStandings: TeamStanding[] = await teamStandingsRes.json()

        const { error } = await supabaseAdmin
            .from("team_standings")
            .upsert(teamStandings, {
                onConflict: "team_name, session_key"
        })

        if (error){
            console.error(error.message)
            return Response.json(
                {success: false, error: error.message},
                {status: 500})
        }

        return Response.json({success: true})
    }
    
    catch(err){
        console.error(err)
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
        )
    }
}
