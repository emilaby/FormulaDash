export default function RaceWeekendCardSkeleton(){
    return (
        <div className="flex flex-col w-full items-center mt-7 lg:mt-11 pt-5 pb-6 lg:pb-8 lg:pt-8 lg:px-5 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-3 lg:h-5 w-24 bg-gray-700 rounded-full" />
            <div className="h-4 lg:h-6 w-52 lg:w-64 bg-gray-700 rounded-full mt-1 lg:mt-2 mb-3" />
            <div className="h-[108px] lg:h-[96px] w-11/12 lg:w-11/12 bg-gray-800 rounded-xl" />
        </div>
    )
}
