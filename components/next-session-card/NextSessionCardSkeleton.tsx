export default function NextSessionCardSkeleton() {
    return (
        <div className="flex flex-col w-full items-center lg:mt-3 pt-7 pb-6 lg:pb-8 lg:pt-8 lg:px-5 border border-mid-blue rounded-3xl animate-pulse">
            <div className="h-3 lg:h-5 w-20 bg-gray-700 rounded-full" />
            <div className="h-4 lg:h-6 w-48 lg:w-64 bg-gray-700 rounded-full mt-1 lg:mt-2 mb-3" />
            <div className="h-[63px] lg:h-[80px] w-10/12 lg:w-11/12 bg-gray-800 rounded-xl" />
        </div>
    )
}