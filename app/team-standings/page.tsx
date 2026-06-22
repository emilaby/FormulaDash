"use client"
import React from "react"

type teamStandingObj = {
    meeting_key: number,
    session_key: number,
    team_name: string,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number,
    team_colour: string
}


export default function TeamStandings(){
    const [teamStandings, setTeamStandings] = React.useState<teamStandingObj[] | null>(null)

    // unified data fetch so when caching route handler data there aren't inconsistencies (e.g. team standings upto date but driver data not)
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


    const sortedData = (teamStandings ? [...teamStandings].sort((a, b) => a.position_current - b.position_current) :[])

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
                <table className="w-full text-left border-collapse">
                    <thead className="text-gray-400">
                        <tr className="text-lg h-12 border-b-3 border-gray-700">
                            <th className="pl-4">Position</th>
                            <th className="pl-3">Name</th>
                            <th className="pl-2">Points</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedData && sortedData.map((standing:teamStandingObj) => (
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