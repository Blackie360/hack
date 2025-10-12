import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingOverview() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-9 w-28" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Card className="p-4 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-3">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 col-span-2" />
                <Skeleton className="h-5" />
              </div>
            ))}
          </Card>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Card className="p-4 space-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-32" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


