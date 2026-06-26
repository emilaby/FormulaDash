export default function NextSessionCardSkeleton() {
    return (
        <div className="flex flex-col w-full items-center sm:mt-3 pt-4 pb-5 sm:pb-7 sm:pt-5 sm:px-5 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-3 sm:h-5 w-20 bg-gray-700 rounded-full" />
            <div className="h-4 sm:h-6 w-48 sm:w-64 bg-gray-700 rounded-full mt-1 sm:mt-2 mb-3" />
            <div className="h-[75px] sm:h-[84px] w-10/12 sm:w-11/12 sm:mt-2 bg-gray-800 rounded-xl" />
        </div>
    )
}