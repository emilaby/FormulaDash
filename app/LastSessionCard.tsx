"use client"
import React from "react"

type sessionDataObj = {
    driver_number: number,
    position: number,
    number_of_laps: number,
    dnf: boolean,
    dns: boolean,
    dsq: boolean,
    meeting_key: number,
    session_key: number,
    points: number,
    gap_to_leader: string,
    duration: number,
    drivers: driverObj
}

type driverObj = {
    meeting_key: number,
    session_key: number,
    driver_number: number,
    broadcast_name: string,
    full_name: string,
    name_acronym: string,
    team_name: string,
    team_colour: string,
    first_name: string,
    last_name: string,
    headshot_url: string,
    country_code: string
}

type sessionInfo = {
    name: string,
    session_type: string //practice race qualifying
}

enum SessionType {
    Race = "race",
    Practice = "practice",
    Qualifying = "qualifying"
}


export default function LastSessionCard (){
    const [sessionInfo, setSessionInfo] = React.useState<sessionInfo | null>(null)
    const [sessionData, setSessionData] = React.useState<sessionDataObj[] | null>(null)
    
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

    
    const formatLaptime = (timeInSecs:number) => {
        const mins = Math.floor(timeInSecs / 60)
        const secs = (timeInSecs % 60).toFixed(3)
        return `${mins}:${secs}`
    }
    const formatRaceTime = (timeInSecs:number) => {
        const hours = Math.floor(timeInSecs / 3600)
        const mins = Math.floor((timeInSecs - (hours*3600)) / 60)
        const secs = (timeInSecs % 60).toFixed(3)
        return `${hours}:${mins}:${secs}`
    }

    return (
        <>
        {(!sessionInfo || !sessionData) &&  
        
        <div className="w-19/20 ml-7 mr-7 mb-7 mt-9 flex flex-col items-center p-5 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-48 w-full bg-gray-800 rounded-lg"/>
        </div>}
        
        {sessionInfo && sessionData  && sessionInfo?.session_type?.trim().toLowerCase() === SessionType.Race && 
        <div className="w-19/20 ml-7 mr-7 mb-7 mt-9 flex flex-col items-center p-5 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-medium text-lg">{sessionInfo?.name}</h1>

            <table className="w-full text-left border-collapse">
                <thead className="text-gray-400">
                    <tr className="text-lg h-12 border-b-3 border-gray-700">
                        <th className="pl-4">Position</th>
                        <th className="pl-3">Name</th>
                        <th className="pl-2">Time</th>
                        <th className="pl-3">Points</th>
                    </tr>
                </thead>
                
                <tbody>
                    {sessionData && sessionData.map((sessionDriver:sessionDataObj) => {
                    return (
                        <tr className="h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition" key={sessionDriver.driver_number}>
                            <td className="w-3/16 p-3 pl-10 text-gray-300">{sessionDriver.position || "-"}</td>
                            <td className="w-6/16 pl-3">
                                <div className="flex gap-10 items-center">
                                    {sessionDriver.drivers.team_colour && <div className="w-7 h-7 rounded-full" style={{ backgroundColor: `#${sessionDriver.drivers.team_colour}`}}></div>}
                                    <p>{sessionDriver.drivers.full_name}</p>
                                </div>
                            </td>
                            <td className="w-5/16 p-3 text-lg">{sessionDriver.position === 1 ? formatRaceTime(sessionDriver.duration) : (sessionDriver.gap_to_leader ? `+${String(sessionDriver.gap_to_leader).replace("+", "")}` : (sessionDriver.dnf ? "DNF" : (sessionDriver.dns ? "DNS" : (sessionDriver.dsq ? "DSQ" : "NC"))))}</td>
                            <td  className="w-2/16 pl-4">{sessionDriver.points}</td>
                        </tr>
                    )})}
                </tbody>
            </table>

        </div>}
        {sessionInfo && sessionData && (sessionInfo?.session_type?.trim().toLowerCase() === SessionType.Practice || sessionInfo?.session_type?.trim().toLowerCase() === SessionType.Qualifying) && 
        <div className="w-19/20 m-7 flex flex-col items-center p-4 border border-mid-blue rounded-3xl hover:bg-white/3 transition">
            <p className="text-xs text-gray-500 mb-2">LAST SESSION</p>
            <h1 className="font-medium text-lg">{sessionInfo?.name}</h1>

            <table className="w-full text-left border-collapse">
                <thead className="text-gray-400">
                    <tr className="text-lg h-12 border-b-3 border-gray-700">
                        <th className="pl-4">Position</th>
                        <th className="pl-3">Name</th>
                        <th className="pl-2">Laptime</th>
                        <th className="pl-3">Laps</th>
                    </tr>
                </thead>
                
                <tbody>
                    {sessionData && sessionData.map((sessionDriver:sessionDataObj) => {
                    return (
                        <tr className="h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition" key={sessionDriver.driver_number}>
                            <td className="w-3/16 p-3 pl-10 text-gray-300">{sessionDriver.position || "-"}</td>
                            <td className="w-6/16">
                                <div className="flex gap-10 items-center">
                                    {sessionDriver.drivers.team_colour && <div className="w-7 h-7 rounded-full" style={{ backgroundColor: `#${sessionDriver.drivers.team_colour}`}}></div>}
                                    <p>{sessionDriver.drivers.full_name}</p>
                                </div>
                            </td>
                            <td className="w-5/16 p-3 text-lg">{sessionDriver.position === 1 ? formatLaptime(sessionDriver.duration) : `+${sessionDriver.gap_to_leader}`}</td>
                            <td  className="w-2/16 p-3">{sessionDriver.number_of_laps}</td>
                        </tr>
                    )})}
                </tbody>
            </table>

        </div>}
        </>
    )
}

                        
