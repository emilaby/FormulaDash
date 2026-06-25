import RaceWeekendCard from "../components/race-weekend-card/RaceWeekendCard"
import LastSessionCard from "../components/LastSessionCard"
import NextSessionCard from "../components/next-session-card/NextSessionCard"
import DriverStandingsGraph from "../components/driver-standings-graph/DriverStandingsGraph"


export default async function Home() {
  return(
    <main className="bg-dark-blue w-full min-h-screen flex flex-col items-center">
      <div className="flex flex-col lg:flex-row lg:items-stretch w-full lg:gap-12">
        <div className="lg:basis-[45%] grow shrink min-w-0 max-w-full lg:max-w-[45%] lg:ml-7 lg:mb-7 lg:mt-5 flex flex-col items-center lg:p-0 p-4 ">
          <NextSessionCard />
          <RaceWeekendCard />
        </div>
        <DriverStandingsGraph />
      </div>
      <div className="p-4 lg:p-7 w-full min-w-0">
        <LastSessionCard />
      </div>
    </main>
  )
}
