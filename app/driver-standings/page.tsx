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
            {!sortedData &&
            <main className="bg-dark-blue min-h-screen p-4 lg:p-7 max-w-full min-w-0">
                <TableSkeleton/>
            </main>}

            {sortedData &&
            <main className="bg-dark-blue min-h-screen p-4 lg:p-7 max-w-full min-w-0">
                <div className="border border-mid-blue hover:bg-white/3 transition rounded-3xl px-3 pt-3 lg:px-4 lg:pt-4 min-w-0 overflow-hidden">
                    <p className="font-semibold text-gray-300 text-base lg:text-lg text-center">DRIVER STANDINGS</p>
                    <table className="w-full text-left border-collapse min-w-0 mt-6">
                        <thead className="text-gray-400">
                            <tr className="text-sm lg:text-lg h-7 lg:h-10 border-b-3 border-gray-700">
                                <th className="lg:pl-4 pb-1 lg:pb-0">
                                    <span className="hidden lg:inline">Position</span>
                                    <span className="lg:hidden">Pos.</span>
                                </th>
                                <th className="lg:pl-3 pb-1 lg:pb-0">Name</th>
                                <th className="lg:pl-2 pb-1 lg:pb-0">Points</th>
                                <th className="lg:pl-3 pb-1 lg:pb-0">Team</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {sortedData && sortedData.map((standing:(DriverStanding & Driver)) => (
                            <tr className="h-12 lg:h-16 text-sm lg:text-lg border-b border-gray-700 last:border-b-0" key={standing.driver_number}>
                                <td className="w-3/16 min-w-0 pl-1 lg:p-3 lg:pl-9 text-gray-300">{standing.position_current}</td>
                                <td className="w-5/16 min-w-0 lg:p-3 lg:text-lg">
                                    <span className="hidden lg:inline">{standing.full_name}</span>
                                    <span className="lg:hidden">{`${standing.first_name.slice(0,1).toUpperCase()} ${standing.last_name.slice(0,1)}${standing.last_name.slice(1)}`}</span>
                                </td>
                                <td className="w-4/16 min-w-0 pl-1 lg:p-3">{standing.points_current}</td>
                                <td className="w-4/16 min-w-0 lg:p-3">
                                    <div className="flex gap-3 lg:gap-7 items-center">
                                        {standing?.team_colour && <div className="min-w-5 min-h-5 lg:min-w-7 lg:min-h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>}
                                        <span className="hidden lg:inline">{standing.team_name}</span>
                                        <span className="lg:hidden">{getShortTeamName(standing.team_name)}</span>
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