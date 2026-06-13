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

type RaceWeekendCardProps = {
    meetingData: meetingDataObj
}

export default function RaceWeekendCard({ meetingData } : RaceWeekendCardProps){
    const liveNow = (Date.parse(meetingData.date_start) > Date.now()) ? false : true

    return (
        <div className="flex-col ">
            <h1>{meetingData.meeting_official_name}</h1>
            <h1>{meetingData.country_flag}</h1>
        </div>
    )
}