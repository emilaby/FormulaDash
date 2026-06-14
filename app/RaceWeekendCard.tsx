import Image from "next/image"

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
    const raceName = meetingData.meeting_official_name.toLowerCase()
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")

    return (
        <div className="w-2/5 h-100 mt-6 ml-4 mr-4 mb-6 flex flex-col items-center p-6 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <div className="flex gap-5 mb-5">
                <h1 className="font-medium text-lg">{raceName}</h1>
                <Image src={meetingData.country_flag} width={48} height={26} className="rounded-md" alt={`${meetingData.country_name} flag`}/>
            </div>
            {liveNow && <p>Live 🟢</p>}
            {!liveNow && <p>Upcoming... ⏳</p>}
            <Image src={meetingData.circuit_image} width={138} height={100} className="mt-3" alt={`${meetingData.circuit_short_name} circuit`}/>
            <p>{`${new Date(meetingData.date_start).toString()} to ${new Date(meetingData.date_end).toString()}`}</p>

        </div>
    )
}