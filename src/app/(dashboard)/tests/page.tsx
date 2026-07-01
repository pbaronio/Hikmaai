import { Suspense } from "react";
import { TestsPageContent } from "@/components/tests/tests-page";

export default function TestsPage() {
  return (
    <Suspense>
      <TestsPageContent />
    </Suspense>
  );
}
