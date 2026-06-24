export default function DriverStandingsGraphSkeleton(){
    return(
        <div className="flex flex-col items-center lg:basis-[55%] lg:min-w-[55%] lg:max-w-[55%] lg:w-[300px] h-[400px] lg:h-[500px] grow shrink mt-7 mb-7 mr-7 ml-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[300px] lg:h-[400px] w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}