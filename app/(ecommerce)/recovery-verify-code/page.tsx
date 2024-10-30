import { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import Container from "@/components/Container";
import RecoveryCodeVerificationForm from "@/components/auth/RecoveryCodeVerificationForm";
import SkeletonRecoveryCodeVerificationForm from "@/components/skeletons/SkeletonRecoveryCodeVerificationForm";


const RecoveryVerifyCodePage = () => {
    return (
        <>
            <PageTitle title="Verificación de Seguridad" subtitle="Ingresa el código de seguridad que recibiste en el inbox." />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <Suspense fallback={<SkeletonRecoveryCodeVerificationForm />}>
                            <RecoveryCodeVerificationForm />
                        </Suspense>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default RecoveryVerifyCodePage;