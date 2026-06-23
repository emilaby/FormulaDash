// Formats time in seconds to mins:secs
const formatLaptime = (timeInSecs:number) => {
        const mins = Math.floor(timeInSecs / 60)
        const secs = (timeInSecs % 60).toFixed(3)
        return `${mins}:${secs}`
}

export default formatLaptime
