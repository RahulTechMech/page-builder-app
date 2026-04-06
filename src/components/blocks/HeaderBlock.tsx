import { usePageStore } from "@/store/usePageStore";
import { Block, HeaderContent } from "@/types/block";
import { cn } from "@/lib/utils";

export function HeaderBlock({ block }: { block: Block }) {
  const { updateBlockContent } = usePageStore();
  const content = block.content as HeaderContent;
  const Tag = content.level === "h1" ? "h1" : content.level === "h2" ? "h2" : "h3";

  const sizeClasses = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-medium",
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {(["h1", "h2", "h3"] as const).map((level) => (
          <button
            key={level}
            onClick={() => updateBlockContent(block.id, { level })}
            className={cn(
              "rounded px-2 py-0.5 text-xs font-medium uppercase transition-colors",
              content.level === level
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {level}
          </button>
        ))}
      </div>
      <Tag
        contentEditable
        suppressContentEditableWarning
        className={cn(sizeClasses[content.level], "outline-none text-foreground")}
        onBlur={(e) => updateBlockContent(block.id, { text: e.currentTarget.textContent || "" })}
      >
        {content.text}
      </Tag>
    </div>
  );
}
