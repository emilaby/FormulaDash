import RaceWeekendCard from "../components/race-weekend-card/RaceWeekendCard"
import LastSessionCard from "../components/LastSessionCard"
import NextSessionCard from "../components/next-session-card/NextSessionCard"
import DriverStandingsGraph from "../components/driver-standings-graph/DriverStandingsGraph"


export default async function Home() {
  return(
    <main className="bg-dark-blue w-full min-h-screen flex flex-col items-center">
      <div className="flex flex-col sm:flex-row w-full sm:gap-12">
        <div className="sm:basis-[45%] grow shrink min-w-0 max-w-full sm:max-w-[45%] sm:ml-8 sm:mb-7 sm:mt-5 flex flex-col items-center sm:p-0 p-7 ">
          <NextSessionCard />
          <RaceWeekendCard />
        </div>
        <DriverStandingsGraph />
      </div>
      <div className="p-7 w-full min-w-0">
        <LastSessionCard />
      </div>
    </main>
  )
}
