function UserResultSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50">
      <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/4 rounded bg-muted animate-pulse" />
      </div>
      <div className="w-20 h-8 rounded-md bg-muted animate-pulse" />
    </div>
  );
}

export default function SearchLoading() {
  return (
    <div className="w-full">
      <UserResultSkeleton />
      <UserResultSkeleton />
      <UserResultSkeleton />
    </div>
  );
}
