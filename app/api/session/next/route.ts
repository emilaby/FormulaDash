import { supabase } from "@/lib/supabase/client"

export const revalidate = 900

// Returns next session data.
export async function GET() {
    try{
        const currentDate = new Date()

        const { data, error } = await supabase
            .from("sessions")
            .select("*")
            .gt("date_start", currentDate.toISOString())
            .order("date_end", { ascending: true })
            .limit(1)
        
        if (error){
            return Response.json(
                {success: false, error: error.message},
                {status: 500}
            )
        }
        
        return Response.json(data[0])
    }

    catch(err) {
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
        )
    }
}


