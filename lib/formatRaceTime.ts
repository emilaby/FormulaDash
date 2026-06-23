const formatRaceTime = (timeInSecs:number) => {
    const hours = Math.floor(timeInSecs / 3600)
    const mins = Math.floor((timeInSecs - (hours*3600)) / 60)
    const secs = (timeInSecs % 60).toFixed(3)
    return `${hours}:${mins}:${secs}`
}

export default formatRaceTime