import Container from "@/components/Container";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import PageTitle from "@/components/PageTitle";

export default function PasswordResetPage() {
    return (
        <>
            <PageTitle title="Crea una nueva contraseña" subtitle="Te sugerimos crear una contraseña segura que contenga Mayúsculas, Números etc.." />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <ResetPasswordForm />
                    </div>
                </div>
            </Container>
        </>
    )
}