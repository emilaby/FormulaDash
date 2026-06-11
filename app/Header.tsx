"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header(){
    const pathname = usePathname()

    return(
    <header className="flex sticky rounded-xs top-0 justify-between items-center bg-med-blue/80 backdrop-blur-xs h-17 shadow-lg">
        <h1 className="text-2xl text-grey font-color ml-3"><Link href="/">FormulaDash</Link></h1>
        <div className="flex gap-10 mr-3">
            <p className= {`text-md pb-1 border-b-2 ${pathname === "/" ? "border-b-2 border-light-blue" : "border-transparent"} hover:border-white`}>
                <Link href="/">Dashboard</Link>
            </p>
            <p className={`text-md pb-1 border-b-2 ${pathname === "/driver-standings" ? "border-b-2 border-light-blue" : "border-transparent"} hover:border-white`}>
                <Link href="/driver-standings">Driver Standings</Link>
            </p>
            <p className={`text-md pb-1 border-b-2 ${pathname === "/team-standings" ? " border-b-2 border-light-blue" : "border-transparent"} hover:border-white`}>
                <Link href="/team-standings">Team Standings</Link>
            </p>

        </div>
    </header>
    )
}