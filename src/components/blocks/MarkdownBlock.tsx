import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { usePageStore } from "@/store/usePageStore";
import { Block, MarkdownContent } from "@/types/block";
import { cn } from "@/lib/utils";

export function MarkdownBlock({ block }: { block: Block }) {
  const { updateBlockContent } = usePageStore();
  const content = block.content as MarkdownContent;
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <button
          onClick={() => setEditing(false)}
          className={cn(
            "rounded px-2 py-0.5 text-xs font-medium transition-colors",
            !editing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          Preview
        </button>
        <button
          onClick={() => setEditing(true)}
          className={cn(
            "rounded px-2 py-0.5 text-xs font-medium transition-colors",
            editing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          Edit
        </button>
      </div>
      {editing ? (
        <textarea
          className="min-h-[6rem] w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          value={content.raw}
          onChange={(e) => updateBlockContent(block.id, { raw: e.target.value })}
          autoFocus
        />
      ) : (
        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
          <ReactMarkdown>{content.raw}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
