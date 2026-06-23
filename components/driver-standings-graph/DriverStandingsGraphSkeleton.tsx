export default function DriverStandingsGraphSkeleton(){
    return(
        <div className="flex flex-col items-center basis-[55%] max-w-[55%] h-[400px] grow shrink mt-7 mb-7 mr-7 ml-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[300px] w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}