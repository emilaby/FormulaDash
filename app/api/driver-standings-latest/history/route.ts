import getMeetings from "@/lib/getMeetings"

export async function GET() {
    type meetingDataObj = {
        meeting_key: number,
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
        is_cancelled: boolean
    }

    try{
        const currentDate = new Date()
        const startDate = new Date(currentDate.getFullYear(), 0, 1)

        const seasonFinishedRacesData = await getMeetings(`date_start>=${startDate.toISOString()}&date_end<=${currentDate.toISOString()}`)

        if (!seasonFinishedRacesData){
            return Response.json(
                {error: "OpenF1 error"},
                {status: 502}
            )
        }

        const seasonRacesMeetingKeys = seasonFinishedRacesData.map((meetingData:meetingDataObj) =>  meetingData.meeting_key)

        let standingsPerRace

        try{
            const meetingsUrl = `https://api.openf1.org/v1/championship_drivers?meeting_key=${seasonRacesMeetingKeys.join("&meeting_key=")}`

            const meetingsRes = await fetch(meetingsUrl, { next: {revalidate: 1000} })
    
            if (!meetingsRes.ok){
                standingsPerRace = null
            }

            const meetingsData = await meetingsRes.json()
            standingsPerRace = meetingsData
            }

        catch(err){
            standingsPerRace = null
        }
        
        return Response.json(standingsPerRace)            
    }
        

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return Response.json(
            {error: "Failed to load data"},
            {status: 500}
    )
    }
}