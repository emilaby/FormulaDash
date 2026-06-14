"use client"
import Image from "next/image"
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
        team_img: string
    }

    const [data, setData] = React.useState<driverStandingObj[] | null>(null)

    React.useEffect(() => {
        async function load(){
            const url = "/api/driver?"
            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setData(newData)
                localStorage.setItem("driverStandings", JSON.stringify(newData))
            }
            else {
                const storedData = localStorage.getItem("driverStandings")
                if (storedData){
                    setData(JSON.parse(storedData))
                }
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
                                <Image src={standing.team_img} width={35} height={20} alt={standing.team_name}/> {standing.team_name}
                            </div>
                        </td>
                    </tr>
                    ))} 
                </tbody>
            </table>
    
        </main>
    )
}