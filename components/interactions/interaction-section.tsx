import { InteractionPanel } from "@/components/interactions/interaction-panel";
import { getPostInteractionState } from "@/lib/interactions/queries";

type InteractionSectionProps = {
  postId: string;
};

export async function InteractionSection({ postId }: InteractionSectionProps) {
  const state = await getPostInteractionState(postId);
  return <InteractionPanel postId={postId} initialState={state} />;
}
