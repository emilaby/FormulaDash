import RaceWeekendCard from "./RaceWeekendCard"

export default async function Home() {
  const meetingDataUrl = `${process.env.BASE_URL}/api/race-weekend`
  const meetingDataRes = await fetch(meetingDataUrl)
  console.log(meetingDataRes.status)
  console.log(meetingDataRes.ok)
  if (!meetingDataRes.ok){
    throw new Error("error fetching data")
  }
  const meetingData = await meetingDataRes.json()

  return(
    <main className="bg-dark-blue">
      <RaceWeekendCard meetingData={meetingData}/>
    </main>
  )
}
