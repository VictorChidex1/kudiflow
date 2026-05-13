import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 bg-transparent">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading KudiFlow...</p>
    </div>
  );
}
