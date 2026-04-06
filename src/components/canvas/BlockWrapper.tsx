import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import { usePageStore } from "@/store/usePageStore";
import { Block } from "@/types/block";
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { MarkdownBlock } from "@/components/blocks/MarkdownBlock";
import { cn } from "@/lib/utils";

const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ block: Block }>> = {
  header: HeaderBlock,
  text: TextBlock,
  image: ImageBlock,
  markdown: MarkdownBlock,
};

export function BlockWrapper({ block }: { block: Block }) {
  const { selectedBlockId, selectBlock, removeBlock } = usePageStore();
  const isSelected = selectedBlockId === block.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Component = BLOCK_COMPONENTS[block.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectBlock(block.id)}
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all",
        isSelected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:border-primary/20 hover:shadow-sm",
        isDragging && "z-50 opacity-80 shadow-xl"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-6 cursor-grab items-center justify-center rounded bg-muted opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(block.id);
        }}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow transition-opacity hover:scale-110 group-hover:opacity-100"
      >
        <Trash2 className="h-3 w-3" />
      </button>

      {Component && <Component block={block} />}
    </div>
  );
}
