export default async function getLastRaceSessionKey(){
    type raceSessionObj = {
        session_key: number,
        session_type: string,
        session_name: string,
        date_start: string,
        date_end: string,
        meeting_key: number,
        circuit_key: number,
        circuit_short_name: string,
        country_key: number,
        country_code: string,
        country_name: string,
        location: string,
        gmt_offset: string,
        year: number,
        is_cancelled: boolean
    }

    try{
        const year = new Date().getFullYear()
        const prevRacesUrl = `https://api.openf1.org/v1/sessions?session_name=Race&year=${year}`

        const prevRacesRes = await fetch(prevRacesUrl)

        if (!prevRacesRes.ok){
            return null
        }
        
        const prevRacesData = await prevRacesRes.json()

        const prevRaceData = prevRacesData
            .filter((session:raceSessionObj) => Date.parse(session.date_end) < Date.now())
            .sort(
                (a:raceSessionObj, b:raceSessionObj) =>
                Date.parse(b.date_end) - Date.parse(a.date_end)
            )[0]

        return prevRaceData?.session_key

    }

    catch(err){
        console.error("Error fetching from OpenF1:", err)
        return null
    }
}

