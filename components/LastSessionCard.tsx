"use client"
import React from "react"
import TableSkeleton from "./TableSkeleton"
import { DriverSessionResult, SessionType, SessionInfo } from "@/types"
import LastSession from "./LastSession"

/**
 * Displays last session name and results.
 */
export default function LastSessionCard (){
    const [sessionInfo, setSessionInfo] = React.useState<SessionInfo | null>(null)
    const [sessionData, setSessionData] = React.useState<DriverSessionResult[] | null>(null)
    
    React.useEffect(() => {
        async function load(){
            try{
                const res = await fetch(`/api/session-results/latest`)
                
                if (!res.ok){
                    return
                }

                const newData = await res.json()
                setSessionInfo(newData.sessionInfo)
                setSessionData(newData.mergedSessionData)
            }
            catch(err){
                console.error(err)
            }
        }
        load()
        const interval = setInterval(load, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
        {(!sessionInfo || !sessionData) && 
        <div className="mt-1"><TableSkeleton/></div>}

        {sessionInfo && sessionData && 
        <LastSession sessionType={sessionInfo.session_type?.trim().toLowerCase() as SessionType} sessionData={sessionData} sessionInfo={sessionInfo}/>}
        </>
    )
}

                        
