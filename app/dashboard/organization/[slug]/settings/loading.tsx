import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSettings() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-9 w-28" />
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </Card>
    </div>
  );
}


