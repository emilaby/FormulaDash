import { supabaseAdmin } from "@/lib/supabase/server"
import { DriverStanding } from "@/types"
import { NextRequest } from "next/server"
import authCheck from "@/lib/authCheck"

// Updates driver_standings table with driver standings data from OpenF1
export async function GET(req:NextRequest) {
    try{
        const authorised = authCheck(req)

        if (!authorised){
            return Response.json(
                {success: false, error: "Unauthorised"},
                {status: 401}
            )
        }
        const driverStandingsUrl = "https://api.openf1.org/v1/championship_drivers"
        const driverStandingsRes = await fetch(driverStandingsUrl)

        if (!driverStandingsRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const driverStandings: DriverStanding[] = await driverStandingsRes.json()

        const { error } = await supabaseAdmin
            .from("driver_standings")
            .upsert(driverStandings, {
                onConflict: "driver_number, session_key"
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
