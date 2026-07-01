import { notFound } from "next/navigation";
import { TestDetailContent } from "@/components/tests/test-detail";
import { getTestById } from "@/lib/data/mock";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = getTestById(id);

  if (!test) notFound();

  return <TestDetailContent test={test} />;
}
