export default function NextSessionCardSkeleton(){
    return (
        <div className="flex flex-col w-full items-center border border-mid-blue p-5 h-[200px] mt-3 rounded-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="h-[100px] w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}