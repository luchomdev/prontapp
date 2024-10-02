import RequestPasswordRecoveryForm from "@/components/auth/RequestPasswordRecoveryForm";
import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";

export default function RequestPasswordRecoveryPage() {
    return (
        <>
            <PageTitle title="Recuperación contraseña Paso 1" subtitle="Digita tu email para comenzar y si existe el email, recibirás un código" />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <RequestPasswordRecoveryForm />
                    </div>
                </div>
            </Container>
        </>
    )
}