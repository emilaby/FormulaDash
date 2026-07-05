// Formats time is secs to hours:mins:secs, if < 1hr, mins:secs
const formatRaceTime = (timeInSecs:number) => {
    const hours = Math.floor(timeInSecs / 3600)
    const mins = Math.floor((timeInSecs - (hours*3600)) / 60)
    const secs = (timeInSecs % 60).toFixed(3)

    return hours === 0 ? `${mins}:${secs}` : `${hours}:${mins}:${secs}`
}

export default formatRaceTime