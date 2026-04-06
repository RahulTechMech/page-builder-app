export type BlockType = "header" | "text" | "image" | "markdown";

export type HeaderLevel = "h1" | "h2" | "h3";

export interface HeaderContent {
  text: string;
  level: HeaderLevel;
}

export interface TextContent {
  text: string;
}

export interface ImageContent {
  url: string;
  alt: string;
}

export interface MarkdownContent {
  raw: string;
}

export type BlockContent = HeaderContent | TextContent | ImageContent | MarkdownContent;

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
}

export const DEFAULT_CONTENT: Record<BlockType, BlockContent> = {
  header: { text: "New Header", level: "h1" } as HeaderContent,
  text: { text: "Start typing..." } as TextContent,
  image: { url: "", alt: "Image" } as ImageContent,
  markdown: { raw: "**Hello** _world_" } as MarkdownContent,
};
