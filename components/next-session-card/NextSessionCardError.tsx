
export default function NextSessionCardError() {
    return (
        <div className="flex flex-col w-full items-center sm:mt-3 pt-4 pb-5 sm:pb-7 sm:pt-5 sm:px-5 border border-mid-blue rounded-3xl">
            <div className="h-3 sm:h-5 w-20 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-red-400">
                    ERROR
                </span>
            </div>

            <div className="h-4 sm:h-6 flex items-center justify-center mt-1 sm:mt-2 mb-3">
                <p className="text-sm sm:text-base text-gray-200 font-medium">
                    Unable to load next session
                </p>
            </div>

            <div className="h-[75px] sm:h-[84px] w-10/12 sm:w-11/12 sm:mt-2 rounded-xl flex flex-col items-center justify-center gap-1">
                <p className="text-xs sm:text-sm text-gray-400 text-center px-2">
                    Please try again later.
                </p>
            </div>
        </div>
    )
}
