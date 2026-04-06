import { LayoutTemplate } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <LayoutTemplate className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">No blocks yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag blocks from the sidebar to start building your page
      </p>
    </div>
  );
}
