import PageTitle from "@/components/PageTitle";
import Container from "@/components/Container";
import RecoveryCodeVerificationForm from "@/components/auth/RecoveryCodeVerificationForm";


const RecoveryVerifyCodePage = () => {
    return (
        <>
            <PageTitle title="Verificación de Seguridad" subtitle="Ingresa el código de seguridad que recibiste en el inbox." />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <RecoveryCodeVerificationForm />
                    </div>
                </div>
            </Container>
        </>
    );
}

export default RecoveryVerifyCodePage;