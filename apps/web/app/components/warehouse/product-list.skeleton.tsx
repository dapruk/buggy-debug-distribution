import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {}
          <div className="hidden space-y-4 md:block">
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-10 w-[250px]" />
            </div>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 border-b p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4 border-b p-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
