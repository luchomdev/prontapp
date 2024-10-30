
import { Suspense } from "react";
import SkeletonConfirmationInfo from "@/components/skeletons/SkeletonConfirmationInfo";
import ConfirmationClientComp from "@/components/ConfirmationClientComp";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<SkeletonConfirmationInfo />}>
      <ConfirmationClientComp />
    </Suspense>
  );
};
