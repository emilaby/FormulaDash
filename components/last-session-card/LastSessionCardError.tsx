export default function LastSessionCardError() {
    return (
        <div className="border border-mid-blue rounded-3xl px-4 pt-3 pb-4 lg:px-5 lg:pt-4 lg:pb-5 min-w-0 overflow-hidden">
            <div className="flex justify-center mb-4">
                <span className="text-xs sm:text-sm text-red-400">
                    ERROR
                </span>
            </div>

            <div className="h-32 w-full rounded-2xl flex flex-col items-center justify-center gap-2">
                <p className="text-sm sm:text-base text-gray-200 font-medium text-center px-4">
                    Unable to load last session card data
                </p>
                <p className="text-xs sm:text-sm text-gray-400 text-center px-4">
                    Please try again later.
                </p>
            </div>
        </div>
    )
}
