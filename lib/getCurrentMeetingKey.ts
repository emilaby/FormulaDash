export default async function getCurrentMeetingKey(){
    type meetingObj = {
        meeting_key: string,
        meeting_name: string,
        meeting_official_name: string,
        location: string,
        country_key: number,
        country_code: string,
        country_name: string,
        country_flag: string,
        circuit_key: number,
        circuit_short_name: string,
        circuit_type: string,
        circuit_info_url: string,
        circuit_image: string,
        gmt_offset: string,
        date_start: string,
        date_end: string, 
        year: number,
        string: boolean

    }
    try{
        const year = new Date().getFullYear()
        const prevMeetingsUrl = `https://api.openf1.org/v1/meetings?year=${year}`

        const prevMeetingsRes = await fetch(prevMeetingsUrl)

        if (!prevMeetingsRes.ok){
            return null
        }
        
        const prevMeetingsData = await prevMeetingsRes.json()

        // finds the latest/next meeting's data
        const prevMeetingData = prevMeetingsData
            .filter((meeting:meetingObj) => Date.parse(meeting.date_end) >= Date.now())
            .sort(
                (a:meetingObj, b:meetingObj) =>
                Date.parse(a.date_end) - Date.parse(b.date_end)
            )[0]

        return prevMeetingData?.meeting_key

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return null
    }
}

