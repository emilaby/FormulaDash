"use client"
import React from "react"

export default function NextSessionCard() {
    type sessionDataObj = {
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
    const [nextSessionData, setnextSessionData] = React.useState<sessionDataObj | null>(null)
            
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
    
    function getCurrentCountdown(targetDate:string | undefined){
        if (targetDate === undefined) return null

        const targetDateMs = new Date(targetDate).getTime()
        const currentMs = new Date().getTime()
        const difference = targetDateMs - currentMs

        const days = String(Math.floor(difference / (1000*60*60*24))).padStart(2, "0")
        const hours = String(Math.floor((difference % (1000*60*60*24) / (1000*60*60)))).padStart(2, "0")
        const mins = String(Math.floor((difference % (1000*60*60)) / (1000*60))).padStart(2, "0")
        const secs = String(Math.floor((difference % (1000*60)) / 1000)).padStart(2, "0")

        return { days, hours, mins, secs }
    }

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
        {(!nextSessionData || !countdown) && 
        <div className="flex flex-col w-full items-center border border-mid-blue p-5 h-[200px] mt-3 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[100px] w-full bg-gray-800 rounded-lg"/>
        </div>}

        {nextSessionData && countdown &&
        <div className="flex flex-col mt-3 w-full items-center p-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs text-gray-500 mb-3">NEXT SESSION</p>
            <h1 className="font-medium text-lg">{`${nextSessionData.country_name} ${nextSessionData.session_name}`}</h1>
            {countdown && <div className="flex flex-wrap min-w-0 items-center max-w-full gap-2 mt-3">
                <div className="flex flex-col items-center bg-blue rounded-xl pt-3 pb-3 pl-3 pr-3 w-24">
                    <h2 className="text-3xl font-bold tabular-nums" >{countdown.days}</h2>
                    <p>DAYS</p>
                </div>
                <p className="text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl pt-3 pb-3 pl-3 pr-3 w-24 ">
                    <h2 className="text-3xl font-bold tabular-nums">{countdown.hours}</h2>
                    <p>HOURS</p>
                </div>
                <p className="text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl pt-3 pb-3 pl-3 pr-3 w-24">
                    <h2 className="text-3xl font-bold tabular-nums">{countdown.mins}</h2>
                    <p>MINS</p>
                </div>
                <p className="text-xl">:</p>
                <div className="flex flex-col items-center bg-blue rounded-xl pt-3 pb-3 pl-3 pr-3 w-24">
                    <h2 className="text-3xl font-bold tabular-nums">{countdown.secs}</h2>
                    <p>SECS</p>
                </div>

            </div>}
        </div>}

        </>

    )
    
}