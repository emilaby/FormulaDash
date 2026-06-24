"use client"
import React from "react"
import TableSkeleton from "@/components/TableSkeleton"
import { TeamStanding } from "@/types"

type TeamStandingMerged = TeamStanding & {team_colour: string}

export default function TeamStandings(){
    const [teamStandings, setTeamStandings] = React.useState<TeamStandingMerged[] | null>(null)

    React.useEffect(() => {
        async function load(){
            const url = "/api/team-standings/latest"
            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setTeamStandings(newData)
            }
            return 
        }
        load()}, [])


    const sortedData:TeamStandingMerged[] | null = (teamStandings ? [...teamStandings].sort((a, b) => a.position_current - b.position_current) : null)

    return (
        <>
        <div className="bg-dark-blue p-1">
            {!sortedData && <TableSkeleton/>}
        </div>
        
        {sortedData &&
        <main className="bg-dark-blue min-h-screen p-4 lg:p-7 max-w-full min-w-0"> 
            <div className="border border-mid-blue rounded-3xl px-3 pt-3 pb-4 lg:px-4 lg:pt-4 lg:pb-5 min-w-0 overflow-hidden">
                <p className="font-semibold text-gray-300 text-base lg:text-lg text-center">TEAM STANDINGS</p>
                <table className="w-full text-left border-collapse min-w-0 mt-6">
                    <thead className="text-gray-400">
                        <tr className="text-sm lg:text-lg h-7 lg:h-10 border-b-3 border-gray-700">
                            <th className="pb-1 lg:pb-0 lg:pl-4">Position</th>
                            <th className="pb-1 lg:pb-0 lg:pl-3">Name</th>
                            <th className="pb-1 lg:pb-0 lg:pl-2">Points</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:TeamStandingMerged) => (
                            <tr className="h-12 lg:h-16 text-sm lg:text-lg border-b border-gray-700 hover:bg-white/3 transition" key={standing.team_name}>
                                <td className="w-3/12 min-w-0 pl-1 lg:p-3 lg:pl-9 text-gray-300">{standing.position_current}</td>
                                <td className="w-7/12 min-w-0 lg:p-3 lg:text-lg">
                                    <div className="flex gap-7 items-center">
                                        {standing.team_colour && <div className="min-w-5 min-h-5 lg:min-w-7 lg:min-h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>} {standing.team_name}
                                    </div>
                                </td>
                                <td  className="w-2/12 min-w-0 lg:p-3 lg:text-lg">{standing.points_current}</td>
                            </tr>
                        ))}
                         
                    </tbody>
                </table>
            </div>
        </main>}
    </>
    )
}