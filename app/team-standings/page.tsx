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
        {!sortedData && <TableSkeleton/>}

        {sortedData &&
        <main className="bg-dark-blue min-h-screen p-4 sm:p-7 max-w-full min-w-0"> 
            <div className="border border-mid-blue rounded-3xl p-3 sm:p-4 min-w-0 overflow-hidden">
                <p className="font-semibold text-gray-300 text-base sm:text-lg text-center">TEAM STANDINGS</p>
                <table className="w-full text-left border-collapse min-w-0 mt-6">
                    <thead className="text-gray-400">
                        <tr className="text-sm sm:text-lg h-7 sm:h-10 border-b-3 border-gray-700">
                            <th className="pb-1 sm:pb-0 sm:pl-4">Position</th>
                            <th className="pb-1 sm:pb-0 sm:pl-3">Name</th>
                            <th className="pb-1 sm:pb-0 sm:pl-2">Points</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:TeamStandingMerged) => (
                            <tr className="h-12 sm:h-16 text-sm sm:text-lg border-b border-gray-700 hover:bg-white/3 transition" key={standing.team_name}>
                                <td className="w-3/12 min-w-0 pl-1 sm:p-3 sm:pl-9 text-gray-300">{standing.position_current}</td>
                                <td className="w-7/12 min-w-0 sm:p-3 sm:text-lg">
                                    <div className="flex gap-7 items-center">
                                        {standing.team_colour && <div className="min-w-5 min-h-5 sm:min-w-7 sm:min-h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>} {standing.team_name}
                                    </div>
                                </td>
                                <td  className="w-2/12 min-w-0 sm:p-3 sm:text-lg">{standing.points_current}</td>
                            </tr>
                        ))}
                         
                    </tbody>
                </table>
            </div>
        </main>}
    </>
    )
}