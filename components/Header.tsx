"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header(){
    const pathname = usePathname()

    return(
    <header className="flex sticky rounded-xs top-0 justify-between items-center bg-med-blue/80 backdrop-blur-xs h-17 shadow-lg z-10">
        <h1 className="text-xl lg:text-3xl text-grey ml-3 mr-3"><Link href="/" className="flex justify-center"><p>Formula</p><p className="text-blue font-normal">Dash</p></Link></h1>
        <div className="flex min-w-0 max-w-full gap-5 text-base lg:gap-10 lg:text-lg mr-3">
            <p className= {`shrink pb-1 border-b-2 ${pathname === "/" ? "border-b-2 border-blue" : "border-transparent"} hover:border-mid-blue`}>
                <Link href="/">Dashboard</Link>
            </p>
            <p className={`shrink pb-1 border-b-2 ${pathname === "/driver-standings" ? "border-b-2 border-blue" : "border-transparent"} hover:border-mid-blue`}>
                <Link href="/driver-standings">
                    <span className="hidden lg:inline">Driver Standings</span>
                    <span className="lg:hidden">Driver</span>
                </Link>
            </p>
            <p className={`shrink pb-1 border-b-2 ${pathname === "/team-standings" ? " border-b-2 border-blue" : "border-transparent"} hover:border-mid-blue`}>
                <Link href="/team-standings">
                    <span className="hidden lg:inline">Team Standings</span>
                    <span className="lg:hidden">Team</span>
                </Link>
            </p>

        </div>
    </header>
    )
}