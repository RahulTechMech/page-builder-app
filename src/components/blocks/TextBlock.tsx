import { usePageStore } from "@/store/usePageStore";
import { Block, TextContent } from "@/types/block";

export function TextBlock({ block }: { block: Block }) {
  const { updateBlockContent } = usePageStore();
  const content = block.content as TextContent;

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="min-h-[2rem] text-foreground leading-relaxed outline-none"
      onBlur={(e) => updateBlockContent(block.id, { text: e.currentTarget.innerHTML })}
      dangerouslySetInnerHTML={{ __html: content.text }}
    />
  );
}
