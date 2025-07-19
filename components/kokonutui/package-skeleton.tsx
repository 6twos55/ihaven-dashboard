import { Skeleton } from "@/components/ui/skeleton"

export default function PackageSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
      <Skeleton className="h-40 w-full" />

      <div className="p-4">
        <div className="flex items-center mb-3">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-3" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
