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

    return (
        <>
        {(!sessionInfo || !sessionData) && <TableSkeleton/>}
        
        {sessionInfo && sessionData && sessionInfo.session_type?.trim().toLowerCase() === SessionType.Race && 
        <div className="border border-mid-blue rounded-3xl p-3 lg:p-4 min-w-0 w-full overflow-hidden flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-medium text-sm lg:text-lg mb-2">{sessionInfo.name}</h1>
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
            </div>
        </div>}
        {sessionInfo && sessionData && (sessionInfo.session_type?.trim().toLowerCase() === SessionType.Practice || sessionInfo.session_type?.trim().toLowerCase() === SessionType.Qualifying) && 
        <div className="border border-mid-blue rounded-3xl p-3 lg:p-4 min-w-0 w-full overflow-hidden flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-medium text-sm lg:text-lg mb-2">{sessionInfo.name}</h1>
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
                                <td className="w-5/16 min-w-0 lg:p-3 lg:text-lg">{sessionDriver.position === 1 ? formatLaptime(sessionDriver.duration) : `+${sessionDriver.gap_to_leader}`}</td>
                                <td  className="w-2/16 min-w-0 lg:pl-4">{sessionDriver.number_of_laps}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>}
        </>
    )
}

                        
