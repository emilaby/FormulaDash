
export default function DriverStandingsGraphError() {
    return (
        <div className="flex flex-col items-center grow shrink lg:w-5/12 mt-10 mb-4 ml-5 mr-5 lg:mr-7 lg:mt-7 lg:mb-7 border border-mid-blue rounded-3xl">
            <div className="h-4 w-32 flex items-center justify-center mb-2 mt-4">
                <span className="text-xs sm:text-sm text-red-400">
                    ERROR
                </span>
            </div>

            <div className="w-full h-[365px] mb-5 rounded-xl flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-gray-200 font-medium">
                    Unable to load driver standings data
                </p>
                <p className="text-xs sm:text-sm text-gray-400 text-center px-4">
                    Please try again later.
                </p>
            </div>

            <div className="w-full h-[115px] lg:h-[110px] rounded-xl" />
        </div>
    )
}
