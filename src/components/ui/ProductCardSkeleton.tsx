import { Card, CardContent } from "./index";

export function ProductCardSkeleton() {
  return (
    <Card variant="simple" className="h-full">
      <div className="h-48 rounded-t-xl bg-neutral-100 dark:bg-neutral-800" />
      <CardContent className="p-6 pb-4 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-8 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </CardContent>
    </Card>
  );
}
