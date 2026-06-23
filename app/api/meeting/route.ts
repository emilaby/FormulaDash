import { supabaseAdmin } from "@/lib/supabase/server"
import { Meeting } from "@/types"
import { NextRequest } from "next/server"
import authCheck from "@/lib/authCheck"

// Updates meetings table with meeting data from OpenF1
export async function GET(req:NextRequest) {
    try{
        const authorised = authCheck(req)

        if (!authorised){
            return Response.json(
                {success: false, error: "Unauthorised"},
                {status: 401}
            )
        }

        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const meetingsUrl = `https://api.openf1.org/v1/meetings?date_start>=${startDate.toISOString()}`
        const meetingsRes = await fetch(meetingsUrl)

        if (!meetingsRes.ok){
            return Response.json(
                {success: false, error: "Error fetching driver data from OpenF1"},
                {status: 502}
            )
        }

        const meetingsData: Meeting[] = await meetingsRes.json()

        const { error } = await supabaseAdmin
            .from("meetings")
            .upsert(meetingsData, {
                onConflict: "meeting_key"
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
