import { useDraggable } from "@dnd-kit/core";
import { Heading, Type, ImageIcon, FileText } from "lucide-react";
import { BlockType } from "@/types/block";
import { cn } from "@/lib/utils";

const PALETTE_ITEMS: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "header", label: "Header", icon: Heading },
  { type: "text", label: "Rich Text", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "markdown", label: "Markdown", icon: FileText },
];

function PaletteItem({ type, label, icon: Icon }: { type: BlockType; label: string; icon: React.ElementType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { fromPalette: true, blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-3 cursor-grab select-none transition-all",
        "hover:shadow-md hover:border-primary/30 hover:scale-[1.02]",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

export function BlockPalette() {
  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card/50 p-4 lg:p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Blocks
      </h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3">
        {PALETTE_ITEMS.map((item) => (
          <PaletteItem key={item.type} {...item} />
        ))}
      </div>
    </aside>
  );
}
