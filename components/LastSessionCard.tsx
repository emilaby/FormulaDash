"use client"
import React from "react"
import TableSkeleton from "./TableSkeleton"
import { DriverSessionResult, SessionType, SessionInfo } from "@/types"
import formatRaceTime from "@/lib/formatRaceTime"
import formatLaptime from "@/lib/formatLaptime"
import parseRaceGap from "@/lib/parseRaceGap"

/**
 * Displays last session name and results.
 */
export default function LastSessionCard (){
    const [sessionInfo, setSessionInfo] = React.useState<SessionInfo | null>(null)
    const [sessionData, setSessionData] = React.useState<DriverSessionResult[] | null>(null)
    
    React.useEffect(() => {
        async function load(){
            try{
                const res = await fetch(`/api/session-results/latest`)
                
                if (!res.ok){
                    return
                }

                const newData = await res.json()
                setSessionInfo(newData.sessionInfo)
                setSessionData(newData.mergedSessionData)
            }
            catch(err){
                console.error(err)
            }
        }
        load()
        const interval = setInterval(load, 60000)

        return () => clearInterval(interval)
    }, [])

    const sessionType = sessionInfo?.session_type?.trim().toLowerCase() as SessionType


    const parseQualiPracGap = (sessionDriver: DriverSessionResult) => {
        if (sessionType === SessionType.Qualifying && sessionDriver.position > 10){
            return <p className="pl-5 lg:pl-6">-</p>
        }
        return `+${Number(sessionDriver.gap_to_leader).toFixed(3)}`
    }


    const sessionTime = (sessionDriver:DriverSessionResult) => {
        if (sessionDriver.position === 1){
            if (sessionType === SessionType.Race){
                return formatRaceTime(sessionDriver.duration)
            }
            return formatLaptime(sessionDriver.duration)
        } 
        else {
            if (sessionType === SessionType.Race){
                return parseRaceGap(sessionDriver)
            }
            return parseQualiPracGap(sessionDriver)
        }
    }

    return (
        <>
        {(!sessionInfo || !sessionData) && 
        <div className="mt-1"><TableSkeleton/></div>}

        {sessionInfo && sessionData && 
        <div className="border border-mid-blue rounded-3xl mb-2 pt-5 pl-3 pr-3 lg:px-0 min-w-0 w-full overflow-hidden flex flex-col items-center hover:bg-white/3 transition">
            <p className="text-xs font-semibold text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-semibold text-base lg:text-lg mb-3 mt-1">{sessionInfo.name}</h1>
            {sessionData.length === 0 && 
            <div className="flex flex-col items-center text-center mt-2 lg:mt-4 mb-5">
                <h2 className="font-bold text-lg lg:text-2xl mb-3 mt-1 animate-pulse">Awaiting latest session data...</h2>
                <p className="italic text-xs lg:text-sm text-gray-500">Data may be delayed by ~2.5 hours due to OpenF1 processing.</p>
            </div>}
            {sessionData.length > 0 &&
            <div className="w-full max-w-full lg:px-4 min-w-0">
                <table className="w-full min-w-0 text-left">
                    <thead className="text-gray-400">
                        <tr className="text-sm lg:text-lg h-7 lg:h-10 border-b-3 border-gray-700">
                            <th className="lg:pl-4 pb-1 lg:pb-0">
                                <span className="hidden lg:inline">Position</span>
                                <span className="lg:hidden">Pos.</span>
                            </th>
                            <th className="lg:pl-3 pb-1 lg:pb-0">Name</th>
                            <th className="lg:pl-3 pb-1 lg:pb-0">{sessionType === SessionType.Race ? "Time" : "Laptime"}</th>
                            <th className="lg:pl-3 pb-1 lg:pb-0">{sessionType === SessionType.Race ? "Points" : "Laps"}</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sessionData && sessionData.map((sessionDriver:DriverSessionResult) => {
                        return (
                            <tr className="h-12 lg:h-16 border-b border-gray-700 last:border-b-0 px-5 text-sm lg:text-base" key={sessionDriver.driver_number}>
                                <td className="w-3/16 min-w-0 lg:p-3 pl-1 lg:pl-9 text-gray-300">{sessionDriver.position || "-"}</td>
                                <td className="w-6/16 min-w-0 lg:pl-3 lg:text-lg">
                                    <div className="flex gap-3 lg:gap-7 items-center min-w-0">
                                        {sessionDriver.drivers.team_colour && <div className="min-w-5 min-h-5 lg:min-w-7 lg:min-h-7 rounded-full" style={{ backgroundColor: `#${sessionDriver.drivers.team_colour}`}}></div>}
                                        <span className="hidden lg:inline">{sessionDriver.drivers.full_name}</span>
                                        <span className="lg:hidden">{sessionDriver.drivers.last_name}</span>
                                    </div>
                                </td>
                                <td className="w-5/16 min-w-0 lg:p-3 lg:text-lg">{sessionTime(sessionDriver)}</td>

                                <td className="w-2/16 min-w-0 lg:pl-4">{sessionType === SessionType.Race ? sessionDriver.points : sessionDriver.number_of_laps}</td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>}
        </div>}
        </>
    )
}

                        
