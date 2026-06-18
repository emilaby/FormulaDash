"use client"
import React from "react"
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

export default function RaceWeekendCard(){
    const [meetingData, setMeetingData] = React.useState<meetingDataObj | null>(null)
        
        React.useEffect(() => {
            async function load(){
                const res = await fetch(`/api/race-weekend`)
                if (res.ok){
                    const newData = await res.json()

                    if (newData){
                        setMeetingData(newData)
                        localStorage.setItem("meetingData", JSON.stringify(newData))
                    }
                    
                }
                else {
                    const storedData = localStorage.getItem("meetingData")
                    if (storedData && storedData != undefined){
                        setMeetingData(JSON.parse(storedData))
                    }
                }
            }
            load()}, [])

    const liveNow = meetingData ? Date.parse(meetingData.date_start) <= Date.now() : false 
    const raceName = meetingData?.meeting_official_name.toLowerCase()
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                        

    return (
        <>
        {!meetingData &&  
        
        <div className="flex flex-col items-center border border-mid-blue p-6 basis-[55%] h-[400px] grow shrink ml-7 mt-7 mb-7 mr-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[300px] w-full bg-gray-800 rounded-lg"/>
        </div>}

        {meetingData && 

        <div className="basis-[45%] grow shrink min-w-0 max-w-[45%] ml-8 mb-7 mt-7 flex flex-col items-center p-6 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            {liveNow && <p className="text-xs text-gray-500 mb-2">CURRENT RACE WEEKEND</p>}
            {!liveNow && <p className="text-xs text-gray-500 mb-2">NEXT RACE WEEKEND</p>}
            <div className="flex gap-5 mb-5">
                <h1 className="font-medium text-lg">{raceName}</h1>
                <Image src={meetingData.country_flag} width={48} height={26} className="rounded-md object-contain" alt={`${meetingData.country_name} flag`}/>
            </div>
            <div className="flex justify-center mt-2">
                <div className="flex-col items-center">
                    {liveNow && <p className="text-center mb-3">Live 🟢</p>}
                    {!liveNow && <p className="text-center mb-3">Upcoming... ⏳</p>}
                    <p className="text-center">{`${new Date(meetingData.date_start).toString()} to ${new Date(meetingData.date_end).toString()}`}</p>
                </div>
                <Image src={meetingData.circuit_image} width={138} height={100} className="mt-3" alt={`${meetingData.circuit_short_name} circuit`}/>
            </div>
           

        </div>}
        </>
    )
}