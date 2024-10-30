
import { Suspense } from "react";
import SkeletonConfirmationInfo from "@/components/skeletons/SkeletonConfirmationInfo";
import CashConfirmationClientComp from "@/components/CashConfirmationClientComp";

export default function CashConfirmationPage() {
  return (
    <Suspense fallback={<SkeletonConfirmationInfo />}>
      <CashConfirmationClientComp />
    </Suspense>
  );
};
