"use client"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase/client"


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
    const [standingsPerRace, setStandingsPerRace] = React.useState<standingObj[] | null>(null)
            
    React.useEffect(() => {
        async function load(){
            const res = await fetch(`/api/driver-standings-latest/history`)
            if (res.ok){
                const newData = await res.json()
                console.log(newData)
                setStandingsPerRace(newData)
            }
            return
        }
        load()}, [])

    const [driverData, setDriverData] = React.useState<driverObj[] | null>(null)
                    
    React.useEffect(() => {
        async function load(){
            const { data, error } = await supabase
                .from("drivers")
                .select("*")
            if (error){
                console.error(error)
                return
            }
            setDriverData(data)
        }
        load()}, [])

    const driverNumsSet = new Set((standingsPerRace??[]).map((standing:standingObj) => standing.driver_number))
    const driverNums = [...driverNumsSet]


    //use standingsPerRace, group by meeting_key so that arr has an object per race, each object has racekey and a property for each driver's pts
    const meetingKeysSet = new Set((standingsPerRace??[]).map((standing:standingObj) => standing.meeting_key))
    const meetingKeys = [...meetingKeysSet]


    const [meetingData, setMeetingData] = React.useState<meetingDataObj[] | null>(null)
            
    React.useEffect(() => {
        async function load(){
            const res = await fetch(`/api/race-weekend/history`)
            if (res.ok){
                const newData = await res.json()

                if (newData){
                    setMeetingData(newData)
                    localStorage.setItem("meetingsData", JSON.stringify(newData))
                }
                
            }
            else {
                const storedData = localStorage.getItem("meetingsData")
                if (storedData && storedData != undefined){
                    setMeetingData(JSON.parse(storedData))
                }
            }
        }
        load()}, [meetingKeys.join(",")])



    const meetingLocation = (meetingKey:number) => meetingData?.find((meeting:meetingDataObj) => meeting.meeting_key === meetingKey)?.location

    


    const standingsPerRaceGrouped = meetingKeys.map((key:number) => {
        const driversInRace = standingsPerRace?.filter((standing:standingObj) => standing.meeting_key === key) 
        return driversInRace?.reduce(
            (row: Record<string, number | string>, driver:standingObj) => {
                row[driver.driver_number] = driver.points_current
                return row
            }, {location: meetingLocation(key) || ""}
        )
    })

    const driverTeamColour = (driverNum:number) => driverData?.find((driver:driverObj) => driver.driver_number === driverNum)?.team_colour
    const nameFromNum = (driverNum:number) => driverData?.find((driver:driverObj) => driver.driver_number === driverNum)?.last_name

    return (
        <>
        {(!standingsPerRace && !meetingData && !driverData) &&  
        
        <div className="flex flex-col items-center basis-[55%] max-w-[55%] h-[400px] grow shrink mt-7 mb-7 mr-7 ml-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[300px] w-full bg-gray-800 rounded-lg"/>
        </div>}
        
        {standingsPerRace && meetingData &&
        <div className="flex flex-col items-center basis-[55%] grow shrink mt-7 mb-7 mr-7 transform-gpu">
            <p className="text-xs pl-10 pb-2 text-gray-500">DRIVER STANDINGS</p>
            <ResponsiveContainer width="100%" height={450}>
            <LineChart data={standingsPerRaceGrouped}>
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