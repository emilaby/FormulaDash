"use client"
import React from "react"
import getCurrentCountdown from "@/lib/getCurrentCountdown"
import NextSessionCardSkeleton from "./NextSessionCardSkeleton"
import { Session } from "@/types"

/**
 * Displays next session name and countdown to it.
 */
export default function NextSessionCard() {
    const [nextSessionData, setnextSessionData] = React.useState<Session | null>(null)
            
    React.useEffect(() => {
        async function load(){
            const res = await fetch(`/api/session/next`)
            if (res.ok){
                const newData = await res.json()

                if (newData){
                    setnextSessionData(newData)
                }
                
            }
            return
        }
        load()}, [])

    const [countdown, setCountdown] = React.useState(() => getCurrentCountdown(nextSessionData?.date_start))

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCurrentCountdown(nextSessionData?.date_start))
        }, 1000)

        return () => clearInterval(interval)
        }, [nextSessionData?.date_start]
    )

    return (
        <>
        {(!nextSessionData || !countdown) && <NextSessionCardSkeleton/>}

        {nextSessionData && countdown &&
        <div className="flex flex-col sm:mt-3 w-full items-center p-4 sm:p-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs text-gray-500 mb-3">NEXT SESSION</p>
            <h1 className="font-medium sm:text-lg">{`${nextSessionData.country_name} ${nextSessionData.session_name}`}</h1>
            {countdown && <div className="flex flex-wrap min-w-0 items-center max-w-full gap-1 sm:gap-2 mt-3 text-xs sm:text-base">
                <div className="flex flex-col items-center bg-blue rounded-xl p-2 sm:p-3 w-14 sm:w-24">
                    <h2 className="text-xl sm:text-3xl font-bold tabular-nums" >{countdown.days}</h2>
                    <p>DAYS</p>
                </div>
                <p className="text-lg sm:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl p-2 sm:p-3 w-14 sm:w-24 ">
                    <h2 className="text-xl sm:text-3xl font-bold tabular-nums">{countdown.hours}</h2>
                    <p>HOURS</p>
                </div>
                <p className="text-lg sm:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl p-2 sm:p-3 w-14 sm:w-24">
                    <h2 className="text-xl sm:text-3xl font-bold tabular-nums">{countdown.mins}</h2>
                    <p>MINS</p>
                </div>
                <p className="text-lg sm:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl p-2 sm:p-3 w-14 sm:w-24">
                    <h2 className="text-xl sm:text-3xl font-bold tabular-nums">{countdown.secs}</h2>
                    <p>SECS</p>
                </div>

            </div>}
        </div>}

        </>

    )
    
}