export default function DriverStandingsGraphSkeleton() {
    return (
        <div className="flex flex-col items-center grow shrink lg:w-5/12 mt-6 mb-4 ml-5 mr-5 lg:mr-7 lg:mt-7 lg:mb-7  animate-pulse">
            {/* Title */}
            <div className="h-4 w-32 bg-gray-700 rounded-full pl-10 mb-2" />
            <div className="w-full h-[365px] mb-5 bg-gray-800 rounded-xl" />
            <div className="w-full h-[115px] bg-gray-800 rounded-xl" />
        </div>
    )
}