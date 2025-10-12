import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingMembers() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="h-7 w-40" />
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-3">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 py-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        ))}
      </Card>
    </div>
  );
}


