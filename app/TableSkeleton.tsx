export default function TableSkeleton(){
    return (
        <div className="w-19/20 min-h-screen m-7 flex flex-col items-center p-7 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-6 w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="min-h-screen w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}