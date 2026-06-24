export default function TableSkeleton(){
    return (
        <div className="min-h-screen lg:m-7 flex flex-col items-center p-7 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-4 w-16 lg:w-24 bg-gray-700 rounded-full mb-2"/>
            <div className="h-6 w-40 lg:w-64 bg-gray-700 rounded-full mb-4"/>
            <div className="min-h-screen w-full bg-gray-800 rounded-lg"/>
        </div>
    )
}
