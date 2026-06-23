export default function RaceWeekendCardSkeleton(){
    return (
        <div className="flex flex-col w-full items-center border border-mid-blue p-5 h-[250px]  ml-7 mt-11 mb-7 mr-5 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[120px] w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}