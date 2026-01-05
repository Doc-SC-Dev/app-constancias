import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <Card className="w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <Skeleton className="h-8 w-48 mx-auto bg-muted" />
          </CardTitle>
          <CardDescription className="text-center">
            <Skeleton className="h-4 w-56 mx-auto mt-2 bg-muted" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Email field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
            </div>
            {/* Password field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full bg-muted" />
        </CardFooter>
      </Card>
    </div>
  );
}
