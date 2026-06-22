import { supabase } from "./supabase/client"

export default async function getMeetingHistory(){
    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const { data: meetingData, error: meetingDataErr } = await supabase
            .from("meetings")
            .select("*")
            .gt("date_start", startDate.toISOString())
            .lt("date_end", currentDate.toISOString())

        
        if (meetingDataErr){
            return null
        }
        
        return meetingData

    }
    catch(err){
        return null
    }

}