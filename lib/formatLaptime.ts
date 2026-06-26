// Formats time in seconds to MM:SSmmm
const formatLaptime = (timeInSecs:number) => {
        const mins = Math.floor(timeInSecs / 60)
        const secsFloat = timeInSecs % 60
        const secs = Math.floor(secsFloat)

        const ms = Math.round((secsFloat - secs) * 1000)

        return `${mins}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`
}

export default formatLaptime
