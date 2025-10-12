import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAudit() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="p-4">
        <Skeleton className="h-6 w-28 mb-3" />
        <div className="grid grid-cols-4 gap-3 mb-2">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
        {[...Array(8)].map((_, i) => (
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


