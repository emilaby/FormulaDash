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
                const res = await fetch(`/api/race-weekend/latest`)
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
    
    const [hourglassFlip, setHourGlassFlip] = React.useState(false)
    React.useEffect(() => {
        const interval = setInterval(() => setHourGlassFlip(prev => !prev), 1000)
        return () => clearInterval(interval)
    }, [])

    const liveNow = meetingData ? Date.parse(meetingData.date_start) <= Date.now() : false
    const raceName = meetingData?.meeting_official_name.toLowerCase()
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                        

    return (
        <>
        {!meetingData &&
        
        <div className="flex flex-col w-full items-center border border-mid-blue p-5 h-[250px]  ml-7 mt-11 mb-7 mr-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[120px] w-full bg-gray-800 rounded-lg"/>
        </div>}

        {meetingData &&

        <div className="overflow-hidden mt-11 flex flex-col items-center w-full p-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            {liveNow && <p className="text-xs text-gray-500 mb-3">CURRENT RACE WEEKEND</p>}
            {!liveNow && <p className="text-xs text-gray-500 mb-3">NEXT RACE WEEKEND</p>}
            <div className="flex gap-5 mb-3">
                <h1 className="font-medium text-lg">{raceName}</h1>
                <Image src={meetingData.country_flag} width={48} height={26} className="rounded-md object-contain" alt={`${meetingData.country_name} flag`}/>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex-col items-center">
                    {liveNow && <p className="text-center">Live <span className="animate-pulse">🟢</span></p>}
                    {!liveNow && <p className="text-center">{`${hourglassFlip ? "⏳" : "⌛"} Upcoming`}</p>}
                    <p className="text-center">{`${new Date(meetingData.date_start).toLocaleString("en-GB", {weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"}).replace(" at", ", ")} 
                        - ${new Date(meetingData.date_end).toLocaleString("en-GB",  {weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"}).replace(" at", ", ")}`}</p>
                </div>
                <Image src={meetingData.circuit_image} width={138} height={100} alt={`${meetingData.circuit_short_name} circuit`}/>
            </div>
        </div>}
        </>
    )
}