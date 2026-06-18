import RaceWeekendCard from "./RaceWeekendCard"
import LastSessionCard from "./LastSessionCard"
import DriverStandingsGraph from "@/DriverStandingsGraph"

export default async function Home() {
  return(
    <main className="bg-dark-blue min-h-screen flex flex-col items-center">
      <div className="flex w-full gap-12 h-[500px]">
         <RaceWeekendCard />
        <DriverStandingsGraph />
      </div>
     
      <LastSessionCard />
    </main>
  )
}
