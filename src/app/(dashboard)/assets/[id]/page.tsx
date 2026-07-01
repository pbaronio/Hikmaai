import { notFound } from "next/navigation";
import { AssetDetailContent } from "@/components/assets/asset-detail";
import { getAgentById } from "@/lib/data/mock";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) notFound();

  return <AssetDetailContent agent={agent} />;
}
