import { getAllContents } from "@/lib/posts";

export type ContentSummary = {
  contentId: string;
  title: string;
  url: string;
  type: "blog" | "note";
};

export async function getContentSummaryMap() {
  const contents = await getAllContents();
  return new Map<string, ContentSummary>(
    contents.map((item) => [
      item.contentId,
      {
        contentId: item.contentId,
        title: item.title,
        url: item.url,
        type: item.type,
      },
    ]),
  );
}
