import RaceWeekendCard from "../components/race-weekend-card/RaceWeekendCard"
import LastSessionCard from "../components/LastSessionCard"
import NextSessionCard from "../components/next-session-card/NextSessionCard"
import DriverStandingsGraph from "../components/driver-standings-graph/DriverStandingsGraph"


export default async function Home() {
  return(
    <main className="bg-dark-blue min-h-screen flex flex-col items-center">
      <div className="flex w-full gap-12 h-[500px]">
        <div className="basis-[45%] grow shrink min-w-0 max-w-[45%] ml-8 mb-7 mt-5 flex flex-col items-center ">
          <NextSessionCard />
          <RaceWeekendCard />
        </div>
        <DriverStandingsGraph />
      </div>
     
      <LastSessionCard />
    </main>
  )
}
