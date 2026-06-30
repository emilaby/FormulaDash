"use client"
import React from "react"
import Image from "next/image"
import RaceWeekendCardSkeleton from "./RaceWeekendCardSkeleton"
import { Meeting } from "@/types"

/**
 * Displays race weekend name, country flag, date, time and circuit image.
 */
export default function RaceWeekendCard(){
    const [meetingData, setMeetingData] = React.useState<Meeting | null>(null)
        
    React.useEffect(() => {
        async function load(){
            const res = await fetch(`/api/race-weekend/latest`)
            if (res.ok){
                const newData = await res.json()

                if (newData){
                    setMeetingData(newData)
                }
                
            }
            return
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
        {!meetingData && <RaceWeekendCardSkeleton/>}

        {meetingData &&

        <div className="overflow-hidden mt-7 mb-2 sm:mt-11 flex flex-col items-center w-full p-5 sm:pb-9 sm:pt-5 sm:px-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs font-semibold text-gray-500 mb-3">{liveNow ? "CURRENT RACE WEEKEND" : "NEXT RACE WEEKEND"}</p>
            <div className="flex items-center gap-5 mb-3 sm:mt-1 sm:mb-6">
                <h1 className="font-semibold text-base sm:text-lg sm:mt-1">{raceName}</h1>
                <Image src={meetingData.country_flag} width={48} height={26} className="rounded-md object-contain w-[44px] h-[24px] sm:w-[48px] sm:h-[26px] " alt={`${meetingData.country_name} flag`}/>
            </div>
            <div className="flex lg:gap-5 justify-center items-center">
                <div className="flex-col items-center text-sm sm:text-[1.1rem] justify-center">
                    {liveNow ? (<p className="text-center font-semibold">Live <span className="animate-pulse">🟢</span></p>) : (<p className="text-center font-semibold">{`${hourglassFlip ? "⏳" : "⌛"} Upcoming`}</p>)}
                    <p className="text-center">
                        {`${new Date(meetingData.date_start).toLocaleString("en-GB", {weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"}).replace(" at", ", ")} 
                        - ${new Date(meetingData.date_end).toLocaleString("en-GB",  {weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"}).replace(" at", ", ")}`}
                    </p>
                </div>
                <Image src={meetingData.circuit_image} width={138} height={100} className="w-[110px] h-[80px] sm:w-[138px] sm:h-[100px] "alt={`${meetingData.circuit_short_name} circuit`}/>
            </div>
        </div>}
        </>
    )
}