export default function RaceWeekendCardSkeleton(){
    return (
        <div className="flex flex-col w-full items-center mt-7 sm:mt-11 pt-7 pb-6 sm:pb-8 sm:pt-5 sm:px-5 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-3 sm:h-5 w-24 bg-gray-800 rounded-full" />
            <div className="h-4 sm:h-6 w-52 sm:w-64 bg-gray-800 rounded-full mt-1 sm:mt-2 mb-3" />
            <div className="h-[100px] sm:h-[108px] w-11/12 sm:w-11/12 sm:mt-2 bg-gray-800 rounded-xl" />
        </div>
    )
}
