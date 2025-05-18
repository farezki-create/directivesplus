
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <>
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </>
  );
}
