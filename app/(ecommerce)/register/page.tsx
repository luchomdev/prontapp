import Container from "@/components/Container";
import RegisterForm from "@/components/auth/RegisterForm";
import PageTitle from "@/components/PageTitle";

export default function RegisterPage(){
    return(
        <>
        <PageTitle title="Registro de Usuario" />
        <Container>
            <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-sm w-full  mx-auto">
                        <RegisterForm />
                        <p className="mt-2 text-center text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <a href="/signin" className="font-medium text-orange-600 hover:text-orange-500">
                                Inicia Sesión
                            </a>
                        </p>
                    </div>
            </div>
        </Container>
        </>
        
    )
}