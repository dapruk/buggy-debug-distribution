import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";

export function ProductCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex h-full flex-col overflow-hidden">
          <div className="bg-muted h-48 w-full animate-pulse" />
          <CardHeader className="p-4">
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow p-4 pt-0">
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
