"use client"
import { TEAMNAMES } from "@/public/data/f1Data"
import Image from "next/image"
import React from "react"

export default function TeamStandings(){
      type teamStandingObj = {
        meeting_key: number,
        session_key: number,
        team_name: string,
        position_start: number,
        position_current: number,
        points_start: number,
        points_current: number,
        team_img: string
    }

    const [data, setData] = React.useState<teamStandingObj[] | null>(null)

    React.useEffect(() => {
        async function load(){
            const url = "/api/team?" +
            TEAMNAMES.map(name => `team_name=${name}`).join("&")

            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setData(newData)
            }
        }
        load()}, [])

    const sortedData = (data ? [...data].sort((a, b) => a.position_current - b.position_current) :[])

    return (
        <main className="bg-dark-blue"> 
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
                        <td className="w-1/6 p-3 pl-10 text-gray-300">{standing.position_current}</td>
                        <td className="w-2/6 p-3">
                            <div className="flex gap-7 items-center">
                                <Image src={standing.team_img} width={35} height={20} alt={standing.team_name}/> {standing.team_name}
                            </div>
                        </td>
                        <td  className="w-2/6 p-3">{standing.points_current}</td>
                    </tr>
                    ))} 
                </tbody>
            </table>
    
        </main>
    )
}