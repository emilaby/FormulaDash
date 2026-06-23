    
export default function getCurrentCountdown(targetDate:string | undefined){
    if (targetDate === undefined) return null

    const targetDateMs = new Date(targetDate).getTime()
    const currentMs = new Date().getTime()
    const difference = targetDateMs - currentMs
    
    if (difference <= 0) return {days: "00", hours: "00", mins:"00", secs:"00"}

    const days = String(Math.floor(difference / (1000*60*60*24))).padStart(2, "0")
    const hours = String(Math.floor((difference % (1000*60*60*24) / (1000*60*60)))).padStart(2, "0")
    const mins = String(Math.floor((difference % (1000*60*60)) / (1000*60))).padStart(2, "0")
    const secs = String(Math.floor((difference % (1000*60)) / 1000)).padStart(2, "0")

    return { days, hours, mins, secs }
}