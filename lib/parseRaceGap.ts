import { DriverSessionResult } from "@/types"

const parseRaceGap = (sessionDriver: DriverSessionResult) => {
    const gap = sessionDriver.gap_to_leader
        
    if (gap){
        if(gap.toLowerCase().includes("lap")){
            return gap
        }
        return `+${String(Number(sessionDriver.gap_to_leader).toFixed(3)).replace("+", "")}` 
    }

    return sessionDriver.dnf ? "DNF" : (sessionDriver.dns ? "DNS" : (sessionDriver.dsq ? "DSQ" : "NC"))
}

export default parseRaceGap