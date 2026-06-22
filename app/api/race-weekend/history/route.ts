import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const { data: meetingData, error: meetingDataErr } = await supabaseAdmin
            .from("meetings")
            .select("*")
            .gt("date_start", startDate.toISOString())
            .lt("date_end", currentDate.toISOString())

        
        if (meetingDataErr){
            return Response.json(
                {success: false, error: meetingDataErr.message},
                {status: 500}
            )
        }
        
        return Response.json(meetingData)

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}








