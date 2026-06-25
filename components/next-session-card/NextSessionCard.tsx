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
        <div className="flex flex-col w-full items-center lg:mt-3 py-5 py-0 lg:pb-9 lg:pt-7 lg:px-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs text-gray-500">NEXT SESSION</p>
            <h1 className="font-medium lg:text-lg lg:mt-1">{`${nextSessionData.country_name} ${nextSessionData.session_name}`}</h1>
            {countdown && <div className="flex flex-wrap min-w-0 items-center max-w-full gap-1 lg:gap-2 mt-3 text-xs lg:text-base">
                <div className="flex flex-col items-center bg-blue rounded-xl px-3 py-2 lg:p-3 w-16 lg:w-24">
                    <h2 className="text-xl lg:text-3xl font-bold tabular-nums" >{countdown.days}</h2>
                    <p>DAYS</p>
                </div>
                <p className="text-lg lg:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl px-3 py-2 lg:p-3 w-16 lg:w-24 ">
                    <h2 className="text-xl lg:text-3xl font-bold tabular-nums">{countdown.hours}</h2>
                    <p>HOURS</p>
                </div>
                <p className="text-lg lg:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl px-3 py-2 lg:p-3 w-16 lg:w-24">
                    <h2 className="text-xl lg:text-3xl font-bold tabular-nums">{countdown.mins}</h2>
                    <p>MINS</p>
                </div>
                <p className="text-lg lg:text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl px-3 py-2 lg:p-3 w-16 lg:w-24">
                    <h2 className="text-xl lg:text-3xl font-bold tabular-nums">{countdown.secs}</h2>
                    <p>SECS</p>
                </div>

            </div>}
        </div>}

        </>

    )
    
}