"use client"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"


type standingObj = {
    meeting_key: number,
    session_key: number,
    driver_number: number,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number
}

type driverObj = {
    meeting_key: number,
    session_key: number,
    driver_number: number,
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

type meetingDataObj = {
    meeting_key: number,
    meeting_name: string,
    meeting_official_name: string,
    location: string,
    country_key: number,
    country_code: string,
    country_name: string,
    country_flag: string,
    circuit_key: number,
    circuit_short_name: string,
    circuit_type: string,
    circuit_info_url: string,
    circuit_image: string,
    gmt_offset: string,
    date_start: string,
    date_end: string,
    year: number,
    is_cancelled: boolean
}
    
export default function DriverStandingsGraph(){
    const [driverNums, setDriverNums] = React.useState<number[] | null>(null)
    const [drivers, setDrivers] = React.useState<driverObj[] | null>(null)
    const [standingsPerRace, setStandingsPerRace] = React.useState<Record<string, number | string>[] | null>(null)

    
    React.useEffect(() => {
        async function load(){
            const url = "/api/driver-standings/graph-data"
            const res = await fetch(url)
            
            if (res.ok){
                const newData = await res.json()
                setDriverNums(newData.driverNums)
                setDrivers(newData.drivers)
                setStandingsPerRace(newData.standingsPerRace)
            }
            return 
        }
        load()}, [])



    const driverTeamColour = (driverNum:number) => drivers?.find((driver:driverObj) => driver.driver_number === driverNum)?.team_colour
    const nameFromNum = (driverNum:number) => drivers?.find((driver:driverObj) => driver.driver_number === driverNum)?.last_name

    return (
        <>
        {(!standingsPerRace || !driverNums || !drivers) &&  
        
        <div className="flex flex-col items-center basis-[55%] max-w-[55%] h-[400px] grow shrink mt-7 mb-7 mr-7 ml-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[300px] w-full bg-gray-800 rounded-lg"/>
        </div>}
        
        {standingsPerRace && drivers && driverNums &&
        <div className="flex flex-col items-center basis-[55%] grow shrink mt-7 mb-7 mr-7 transform-gpu">
            <p className="text-xs pl-10 pb-2 text-gray-500">DRIVER STANDINGS</p>
            <ResponsiveContainer width="100%" height={450}>
            <LineChart data={standingsPerRace}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3738" vertical={false}/>
                <XAxis dataKey="location" stroke="#9ca3af" interval={0} angle={-90} height={120} tick={{dy:5, dx:-10, fontSize:14}} tickLine={false} textAnchor="end"/>
                <YAxis tickLine={false} axisLine={false}/>
                <Legend wrapperStyle={{ paddingLeft: 60 }}/>
                {driverNums.map((num:number) => (
                    <Line type="monotone" dataKey={num} name={nameFromNum(num)} stroke={`#${driverTeamColour(num)}`} strokeWidth={2} key={num} dot={false} activeDot={false}/>
                ))}
                
            </LineChart>
        </ResponsiveContainer>
        </div>
        }
        </>
    )
    
}