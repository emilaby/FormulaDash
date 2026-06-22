import { supabaseAdmin } from "@/lib/supabase/server"
import getLastSessionKey from "@/lib/getLastSessionKey"

export async function GET() {
    try{
        const lastSessionKey = await getLastSessionKey()

        if(!lastSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last session key from database"},
                {status: 500}
            )
        }


        const { data: latestSessionResult, error: latestSessionResultErr } = await supabaseAdmin
            .from("session_results")
            .select("*")
            .eq("session_key", lastSessionKey)
        
        if (latestSessionResultErr){
            console.error(latestSessionResultErr.message)
            return Response.json(
                {success: false, error: latestSessionResultErr.message},
                {status: 500}
            )
        }

        return Response.json(latestSessionResult)

    }

    catch(err) {
        return Response.json(
            {success: false, error: "Failed to load data"},
            {status: 500}
        )
    }
}


