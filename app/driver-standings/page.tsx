"use client"
import React from "react"

export default function DriverStandings(){
      type driverStandingObj = {
        meeting_key: number,
        session_key: number,
        driver_number: number,
        position_start: number,
        position_current: number,
        points_start: number,
        points_current: number,
        broadcast_name: string,
        full_name: string,
        name_acronym: string,
        team_name: string,
        team_colour: string,
        first_name: string,
        last_name: string,
        headshot_url: string,
        country_code: string,
    }

    const [driverStandingsData, setDriverStandingsData] = React.useState<driverStandingObj[] | null>(null)

    React.useEffect(() => {
        async function load(){
            const url = "/api/driver-standings/latest"
            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setDriverStandingsData(newData)
            }
            return
        }
        load()}, [])

    const sortedData = (driverStandingsData ? [...driverStandingsData].sort((a, b) => a.position_current - b.position_current) :[])

    return (
        <>
        {!sortedData &&
            <div className="w-19/20 min-h-screen m-7 flex flex-col items-center p-7 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-48 w-full bg-gray-800 rounded-lg"/>
        </div>}

        {sortedData &&
        <main className="bg-dark-blue min-h-screen p-7"> 
            <div className="border border-mid-blue rounded-3xl p-2">
                <table className="w-full text-left border-collapse ">
                    <thead className="text-gray-400">
                        <tr className="text-lg h-12 border-b-3 border-gray-700">
                            <th className="pl-4">Position</th>
                            <th className="pl-3">Name</th>
                            <th className="pl-2">Points</th>
                            <th className="pl-3">Team</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:driverStandingObj) => (
                        <tr className="h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition" key={standing.driver_number}>
                            <td className="w-3/16 p-3 pl-10 text-gray-300">{standing.position_current}</td>
                            <td className="w-5/16 p-3 text-lg">{standing.full_name}</td>
                            <td  className="w-4/16 p-3">{standing.points_current}</td>
                            <td className="w-4/16 p-3">
                                <div className="flex gap-7 items-center">
                                    {standing?.team_colour && <div className="w-7 h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>}{standing.team_name}
                                </div>
                            </td>
                        </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
    
        </main>}
    </>
    )
}