import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { usePageStore } from "@/store/usePageStore";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockType } from "@/types/block";
import { BlockPalette } from "@/components/palette/BlockPalette";
import { BlockWrapper } from "@/components/canvas/BlockWrapper";
import { EmptyState } from "@/components/canvas/EmptyState";
import { useDroppable } from "@dnd-kit/core";

function CanvasDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 transition-colors ${isOver ? "bg-primary/5" : ""}`}
    >
      {children}
    </div>
  );
}

export function PageBuilder() {
  const { blocks, addBlock, reorderBlocks, selectBlock, undo, redo, canUndo, canRedo } = usePageStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const data = active.data.current;

    // From palette
    if (data?.fromPalette) {
      const blockType = data.blockType as BlockType;
      // Find insertion index
      if (over.id === "canvas-drop-zone") {
        addBlock(blockType);
      } else {
        const overIndex = blocks.findIndex((b) => b.id === over.id);
        addBlock(blockType, overIndex >= 0 ? overIndex : undefined);
      }
      return;
    }

    // Reorder
    if (active.id !== over.id && over.id !== "canvas-drop-zone") {
      reorderBlocks(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={blocks.length === 0 ? pointerWithin : closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-screen flex-col lg:flex-row" onClick={() => selectBlock(null)}>
        <BlockPalette />

        <CanvasDropZone>
          <div className="mx-auto w-full max-w-3xl p-4 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">My Page</h1>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" disabled={!canUndo} onClick={(e) => { e.stopPropagation(); undo(); }} title="Undo (Ctrl+Z)">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={!canRedo} onClick={(e) => { e.stopPropagation(); redo(); }} title="Redo (Ctrl+Shift+Z)">
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {blocks.length === 0 ? (
              <EmptyState />
            ) : (
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  {blocks.map((block) => (
                    <BlockWrapper key={block.id} block={block} />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </CanvasDropZone>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="rounded-lg border border-primary/30 bg-card/90 p-3 shadow-xl backdrop-blur">
            <span className="text-sm text-muted-foreground">
              {activeId.startsWith("palette-") ? activeId.replace("palette-", "") + " block" : "Moving block..."}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
