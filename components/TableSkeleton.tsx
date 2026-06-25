export default function TableSkeleton(){
   return (
        <div className="border border-mid-blue rounded-3xl px-4 pt-3 pb-4 lg:px-5 lg:pt-4 lg:pb-5 min-w-0 overflow-hidden animate-pulse">
            <div className="flex justify-center mb-6">
                <div className="h-6 lg:h-8 w-40 bg-gray-700 rounded-full" />
            </div>
            <div className="h-[620px] lg:h-[830px] w-full bg-gray-700 rounded-2xl" />
        </div>
   )

}