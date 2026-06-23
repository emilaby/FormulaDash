"use client"
import React from "react"
import TableSkeleton from "@/components/TableSkeleton"
import { DriverStanding, Driver } from "@/types"

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
                        {sortedData && sortedData.map((standing:(DriverStanding & Driver)) => (
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