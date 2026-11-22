
export default function RaceWeekendCardError() {
    return (
        <div className="flex flex-col w-full items-center mt-7 sm:mt-11 pt-7 pb-6 sm:pb-8 sm:pt-5 sm:px-5 border border-mid-blue rounded-3xl">
            <div className="h-3 sm:h-5 w-24 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-red-400">
                    ERROR
                </span>
            </div>

            <div className="h-4 sm:h-6 flex items-center justify-center mt-1 sm:mt-2 mb-3">
                <p className="text-sm sm:text-base text-gray-200 font-medium">
                    Unable to load race weekend data
                </p>
            </div>

            <div className="h-[120px] sm:h-[124px] w-11/12 sm:w-11/12 sm:mt-2 rounded-xl flex flex-col items-center justify-center gap-1">
                <p className="text-xs sm:text-sm text-gray-400 text-center px-2">
                    Please try again later.
                </p>
            </div>
        </div>
    )
}
