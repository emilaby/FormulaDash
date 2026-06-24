"use client"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import DriverStandingsGraphSkeleton from "./DriverStandingsGraphSkeleton"
import { Driver } from "@/types"

/**
 * Displays a graph of driver standings over the current season so far.
 */
export default function DriverStandingsGraph(){
    const [driverNums, setDriverNums] = React.useState<number[] | null>(null)
    const [drivers, setDrivers] = React.useState<Driver[] | null>(null)
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



    const driverTeamColour = (driverNum:number) => drivers?.find((driver:Driver) => driver.driver_number === driverNum)?.team_colour
    const nameFromNum = (driverNum:number) => drivers?.find((driver:Driver) => driver.driver_number === driverNum)?.last_name

    return (
        <>
        {(!standingsPerRace || !driverNums || !drivers) &&  <div className="flex flex-col items-center"><DriverStandingsGraphSkeleton/></div>}
        
        {standingsPerRace && drivers && driverNums &&
        <div className="flex flex-col items-center grow shrink mt-4 mb-4 mr-7 lg:mt-7 lg:mb-7 lg:mr-7 transform-gpu">
            <p className="text-xs pl-10 pb-2 text-gray-500">DRIVER STANDINGS</p>
            <div className="w-full h-[500px] lg:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={standingsPerRace}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3738" vertical={false}/>
                    <XAxis dataKey="location" stroke="#9ca3af" interval="preserveStartEnd" angle={-90} height={90} tick={{dy:5, dx:-10, fontSize:12}} tickLine={false} textAnchor="end"/>
                    <YAxis tickLine={false} axisLine={false} tick={{fontSize:13}}/>
                    <Legend 
                        wrapperStyle={{ paddingLeft: 50 }}
                        formatter={(value) => (
                            <span className="text-xs lg:text-base">{value}</span>)}
                    />
                    {driverNums.map((num:number) => (
                        <Line type="monotone" dataKey={num} name={nameFromNum(num)} stroke={`#${driverTeamColour(num)}`} strokeWidth={2} key={num} dot={false} activeDot={false} isAnimationActive={true}
                            animationBegin={0} animationDuration={1000} animationEasing="ease"/>
                    ))}
                    
                </LineChart>
                </ResponsiveContainer>
            </div>    
        </div>
        }
        </>
    )
    
}