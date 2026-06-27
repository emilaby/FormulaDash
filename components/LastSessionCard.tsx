"use client"
import React from "react"
import formatLaptime from "@/lib/formatLaptime"
import formatRaceTime from "@/lib/formatRaceTime"
import TableSkeleton from "./TableSkeleton"
import { DriverSessionResult } from "@/types"
import getShortDriverName from "@/lib/getShortDriverName"

type sessionInfo = {
    name: string,
    session_type: string //practice race qualifying
}

enum SessionType {
    Race = "race",
    Practice = "practice",
    Qualifying = "qualifying"
}

/**
 * Displays last session name and results.
 */
export default function LastSessionCard (){
    const [sessionInfo, setSessionInfo] = React.useState<sessionInfo | null>(null)
    const [sessionData, setSessionData] = React.useState<DriverSessionResult[] | null>(null)
    
    React.useEffect(() => {
        async function load(){
            const res = await fetch(`/api/session-results/latest`)
            
            if (res.ok){
                const newData = await res.json()
                setSessionInfo(newData.sessionInfo)
                setSessionData(newData.mergedSessionData)
            }
            return
        }
    load()}, [])

    const parsedQualiGap = (sessionDriver: DriverSessionResult, sessionInfo:sessionInfo) => {
        const sessionType = sessionInfo.session_type?.trim().toLowerCase()
        if (sessionType === SessionType.Qualifying && sessionDriver.position > 10){
            return <p className="pl-5 lg:pl-6">-</p>
        }
        return `+${Number(sessionDriver.gap_to_leader).toFixed(3)}`
    }

    return (
        <>
        {(!sessionInfo || !sessionData) && <div className="mt-1"><TableSkeleton/></div>}

        {sessionInfo && sessionData && sessionInfo.session_type?.trim().toLowerCase() === SessionType.Race && 
        <div className="border border-mid-blue rounded-3xl mb-2 p-3 py-5 lg:px-0 min-w-0 w-full overflow-hidden flex flex-col items-center">
            <p className="text-xs font-semibold text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-semibold text-base lg:text-lg mb-3 mt-1">{sessionInfo.name}</h1>
            {sessionData.length === 0 && 
            <div className="border border-mid-blue rounded-3xl mb-2 p-3 py-5 lg:px-0 min-w-0 w-full overflow-hidden flex flex-col items-center">
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
                            <th className="lg:pl-3 pb-1 lg:pb-0">Time</th>
                            <th className="lg:pl-3 pb-1 lg:pb-0">Points</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sessionData && sessionData.map((sessionDriver:DriverSessionResult) => {
                        return (
                            <tr className="h-12 lg:h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition text-sm lg:text-base" key={sessionDriver.driver_number}>
                                <td className="w-3/16 min-w-0 lg:p-3 pl-1 lg:pl-9 text-gray-300">{sessionDriver.position || "-"}</td>
                                <td className="w-6/16 min-w-0 lg:pl-3 lg:text-lg">
                                    <div className="flex gap-3 lg:gap-7 items-center min-w-0">
                                        {sessionDriver.drivers.team_colour && <div className="min-w-5 min-h-5 lg:min-w-7 lg:min-h-7 rounded-full" style={{ backgroundColor: `#${sessionDriver.drivers.team_colour}`}}></div>}
                                        <span className="hidden lg:inline">{sessionDriver.drivers.full_name}</span>
                                        <span className="lg:hidden">{sessionDriver.drivers.last_name}</span>
                                    </div>
                                </td>
                                <td className="w-5/16 min-w-0 lg:p-3 lg:text-lg">{sessionDriver.position === 1 ? formatRaceTime(sessionDriver.duration) : (sessionDriver.gap_to_leader ? 
                                    `+${String(sessionDriver.gap_to_leader).replace("+", "")}` : 
                                        (sessionDriver.dnf ? "DNF" : (sessionDriver.dns ? "DNS" : (sessionDriver.dsq ? "DSQ" : "NC"))))}</td>

                                <td className="w-2/16 min-w-0 lg:pl-4">{sessionDriver.points}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>}
        </div>}
        {sessionInfo && sessionData && (sessionInfo.session_type?.trim().toLowerCase() === SessionType.Practice || sessionInfo.session_type?.trim().toLowerCase() === SessionType.Qualifying) && 
        <div className="border border-mid-blue rounded-3xl mb-2 p-3 py-5 lg:p-4 lg:pt-5 min-w-0 w-full overflow-hidden flex flex-col items-center">
            <p className="text-xs font-semibold text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-semibold text-base lg:text-lg mb-2 lg:mt-2">{sessionInfo.name}</h1>
            {sessionData.length === 0 && 
            <div className="flex flex-col items-center text-center mt-4 lg:mb-2">
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
                            <th className="lg:pl-4 pb-1 lg:pb-0">Name</th>
                            <th className="lg:pl-4 pb-1 lg:pb-0">Laptime</th>
                            <th className="lg:pl-4 pb-1 lg:pb-0">Laps</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sessionData && sessionData.map((sessionDriver:DriverSessionResult) => {
                        return (
                            <tr className="h-12 lg:h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition text-sm lg:text-base" key={sessionDriver.driver_number}>
                                <td className="w-3/16 min-w-0 lg:p-3 pl-1 lg:pl-9 text-gray-300">{sessionDriver.position || "-"}</td>
                                <td className="w-6/16 min-w-0 lg:pl-3 lg:text-lg">
                                    <div className="flex gap-3 lg:gap-7 items-center min-w-0">
                                        {sessionDriver.drivers.team_colour && <div className="min-w-5 min-h-5 lg:min-w-7 lg:min-h-7 rounded-full" style={{ backgroundColor: `#${sessionDriver.drivers.team_colour}`}}></div>}
                                        <span className="hidden lg:inline">{sessionDriver.drivers.full_name}</span>
                                        <span className="lg:hidden">{sessionDriver.drivers.last_name}</span>
                                    </div>
                                </td>
                                <td className="w-5/16 min-w-0 lg:p-3 lg:text-lg">{sessionDriver.position === 1 ? formatLaptime(sessionDriver.duration) : parsedQualiGap(sessionDriver, sessionInfo)}</td>
                                <td  className="w-2/16 min-w-0 lg:pl-4">{sessionDriver.number_of_laps}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>}
        </div>}
        </>
    )
}

                        
