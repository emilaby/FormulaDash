import { supabaseAdmin } from "@/lib/supabase/server"
import { Driver } from "@/types"
import { NextRequest } from "next/server"
import authCheck from "@/lib/authCheck"

// Updates drivers table with driver data from OpenF1.
export async function GET(req:NextRequest) {
    try{
        const authorised = authCheck(req)

        if (!authorised){
            return Response.json(
                {success: false, error: "Unauthorised"},
                {status: 401}
            )
        }

        const driverDataUrl = "https://api.openf1.org/v1/drivers"
        const driverDataRes = await fetch(driverDataUrl)

        if (!driverDataRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const driverData: Driver[] = await driverDataRes.json()

        const { error } = await supabaseAdmin
            .from("drivers")
            .upsert(driverData, {
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
