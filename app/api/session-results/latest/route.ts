import { supabase } from "@/lib/supabase/client"
import getLastSessionKey from "@/lib/getLastSessionKey"
import getLastSession from "@/lib/getLastSession"

export async function GET() {
    try{
        const lastSessionKey = await getLastSessionKey()
        
        if(!lastSessionKey){
            return Response.json(
                {success: false, error: "Error fetching last session key from database"},
                {status: 500}
            )
        }

        const { data: latestSessionResult, error: latestSessionResultErr } = await supabase
            .from("session_results")
            .select("*, drivers(*)")
            .eq("session_key", lastSessionKey)
    
        
        if (latestSessionResultErr){
            console.error(latestSessionResultErr.message)
            return Response.json(
                {success: false, error: latestSessionResultErr.message},
                {status: 500}
            )
        }

        const lastSession = await getLastSession()
        if (!lastSession){
            return Response.json(
                {success: false, error: "Error fetching last session data from database"},
                {status: 500}
            )
        }

        
        const positionDriverData = latestSessionResult.filter((sessionDriver) => sessionDriver.position)
        const noPositionDriverData = latestSessionResult.filter((sessionDriver) => !sessionDriver.position)
        const sortedPositionDriverData = (positionDriverData ? [...positionDriverData].sort((a, b) => a.position - b.position) :[])
        const sortedNoPositionDriverData = (noPositionDriverData ? [...noPositionDriverData].sort((a, b) => b.number_of_laps - a.number_of_laps) :[])

        const mergedSessionData = [...sortedPositionDriverData, ...sortedNoPositionDriverData]

        return Response.json({
            sessionInfo: lastSession,
            mergedSessionData: mergedSessionData
        })

    }
    catch(err){
        return Response.json(
            {success: false, error: err},
            {status: 500}
        )
    }
}
