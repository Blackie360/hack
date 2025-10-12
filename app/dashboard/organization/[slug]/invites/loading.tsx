import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingInvites() {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-7 w-28" />
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-6" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    </div>
  );
}


