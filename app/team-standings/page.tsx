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
        <main className="bg-dark-blue min-h-screen p-7 max-w-full"> 
            <div className="border border-mid-blue rounded-3xl p-2">
                <table className="w-full text-left border-collapse">
                    <thead className="text-gray-400">
                        <tr className="text-lg h-12 border-b-3 border-gray-700">
                            <th className="pl-4">Position</th>
                            <th className="pl-3">Name</th>
                            <th className="pl-2">Points</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:TeamStandingMerged) => (
                            <tr className="h-16 border-b border-gray-700 px-5 hover:bg-white/3 transition" key={standing.team_name}>
                                <td className="w-3/12 p-3 pl-10 text-gray-300">{standing.position_current}</td>
                                <td className="w-6/12 p-3">
                                    <div className="flex gap-7 items-center">
                                        {standing.team_colour && <div className="w-7 h-7 rounded-full" style={{ backgroundColor: `#${standing.team_colour}`}}></div>} {standing.team_name}
                                    </div>
                                </td>
                                <td  className="w-3/12 p-3">{standing.points_current}</td>
                            </tr>
                        ))}
                         
                    </tbody>
                </table>
            </div>
        </main>}
    </>
    )
}