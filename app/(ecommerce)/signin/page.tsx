import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import SigninForm from "@/components/auth/SigninForm";

export default function SigninPage() {
    return (
        <>
            <PageTitle title="Iniciar Sesión" />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <SigninForm />
                        <p className="mt-2 text-center text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <a href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                                Regístrate aquí
                            </a>
                        </p>
                    </div>
                </div>
            </Container>
        </>

    )
}