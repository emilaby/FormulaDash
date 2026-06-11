"use client"
import { DRIVERNUMBERS } from "@/data/driverNumbers"
import React from "react"

export default function DriverStandings(){
      type standingObj = {
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
        country_code: string
    }

    const [data, setData] = React.useState<standingObj[] | null>(null)

    React.useEffect(() => {
        async function load(){
            const url = "/api/driver?" +
            DRIVERNUMBERS.map(num => `driver_number=${num}`).join("&")

            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setData(newData)
            }
        }
        load()}, [])

    const sortedData = (data ? [...data].sort((a, b) => a.position_current - b.position_current) :[])

    return (
        <> 
            <table className="w-100 text-left border-collapse">
                <thead>
                    <tr className="border-b-3 border-gray-700">
                        <th>Name</th>
                        <th>Points</th>
                        <th>Team</th>
                    </tr>
                </thead>
                
                <tbody>
                    {sortedData && sortedData.map((standing:standingObj) => (
                    <tr className="border-b border-gray-700 px-5" key={standing.driver_number}>
                        <td>{standing.full_name}</td>
                        <td>{standing.points_current}</td>
                        <td>{standing.team_name}</td>
                    </tr>
                    ))} 
                </tbody>
            </table>
    
        </>
    )
}