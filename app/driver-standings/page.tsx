"use client"
import React from "react"
import TableSkeleton from "@/components/TableSkeleton"
import { DriverStanding, Driver } from "@/types"
import getShortTeamName from "@/lib/getShortTeamName"

export default function DriverStandings(){

    const [driverStandingsData, setDriverStandingsData] = React.useState<(DriverStanding & Driver)[]| null>(null)

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

    const sortedData:(DriverStanding & Driver)[]| null = (driverStandingsData ? [...driverStandingsData].sort((a, b) => a.position_current - b.position_current) : null)

    return (
        <>
        {!sortedData && <TableSkeleton/>}

        {sortedData &&
        <main className="bg-dark-blue min-h-screen p-4 sm:p-7 max-w-full min-w-0"> 
            <div className="border border-mid-blue rounded-3xl p-3 sm:p-4 min-w-0 overflow-hidden">
                <table className="w-full text-left border-collapse min-w-0">
                    <thead className="text-gray-400">
                        <tr className="text-sm sm:text-lg h-7 sm:h-10 border-b-3 border-gray-700">
                            <th className="sm:pl-4 pb-1 sm:pb-0">
                                <span className="hidden sm:inline">Position</span>
                                <span className="sm:hidden">Pos.</span>
                            </th>
                            <th className="sm:pl-3 pb-1 sm:pb-0">Name</th>
                            <th className="sm:pl-2 pb-1 sm:pb-0">Points</th>
                            <th className="sm:pl-3 pb-1 sm:pb-0">Team</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:(DriverStanding & Driver)) => (
                        <tr className="h-12 sm:h-16 text-sm sm:text-lg border-b border-gray-700 hover:bg-white/3 transition" key={standing.driver_number}>
                            <td className="w-3/16 min-w-0 pl-1 sm:p-3 sm:pl-9 text-gray-300">{standing.position_current}</td>
                            <td className="w-5/16 min-w-0 sm:p-3 sm:text-lg">
                                <span className="hidden sm:inline">{standing.full_name}</span>
                                <span className="sm:hidden">{`${standing.first_name.slice(0,1).toUpperCase()} ${standing.last_name.slice(0,1)}${standing.last_name.slice(1)}`}</span>
                            </td>
                            <td className="w-4/16 min-w-0 pl-1 sm:pl-0 sm:p-3">{standing.points_current}</td>
                            <td className="w-4/16 min-w-0 sm:p-3">
                                <div className="flex gap-3 sm:gap-7 items-center">
                                    {standing?.team_colour && <div className="min-w-5 min-h-5 sm:min-w-7 sm:min-h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>}
                                    <span className="hidden sm:inline">{standing.team_name}</span>
                                    <span className="sm:hidden">{getShortTeamName(standing.team_name)}</span>
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