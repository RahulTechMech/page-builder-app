import { useState } from "react";
import { usePageStore } from "@/store/usePageStore";
import { Block, ImageContent } from "@/types/block";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";

export function ImageBlock({ block }: { block: Block }) {
  const { updateBlockContent } = usePageStore();
  const content = block.content as ImageContent;
  const [url, setUrl] = useState(content.url);

  const handleBlur = () => {
    updateBlockContent(block.id, { url });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Paste image URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="text-sm"
      />
      {content.url ? (
        <img
          src={content.url}
          alt={content.alt}
          className="max-h-80 w-full rounded-lg object-cover border border-border"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-1 h-8 w-8" />
            <p className="text-xs">Enter a URL above to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
