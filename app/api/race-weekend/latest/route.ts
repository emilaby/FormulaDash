import { supabase } from "@/lib/supabase/client"

export const revalidate = 900

// Returns latest race's meeting data.
export async function GET() {
    try{

        const currentDate = new Date()

        const { data: meetingData, error: meetingDataErr } = await supabase
            .from("meetings")
            .select("*")
            .gt("date_end", currentDate.toISOString())
            .order("date_end", { ascending: true })
            .limit(1)
        
        if (meetingDataErr){
            return Response.json(
                {success: false, error: meetingDataErr.message},
                {status: 500}
            )
        }
        
        return Response.json(meetingData[0])

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}
