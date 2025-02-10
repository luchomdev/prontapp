import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Rutas protegidas para usuarios normales
const NORMAL_USER_PROTECTED_ROUTES = ['/panel', '/checkout', '/payment', '/confirmation', '/cash-confirmation']

// Rutas protegidas para administradores (todas las que empiezan con /console)
const ADMIN_PROTECTED_ROUTES = '/console'

function isNormalUserProtectedRoute(path: string): boolean {
  return NORMAL_USER_PROTECTED_ROUTES.some(route => path.startsWith(route))
}

function isAdminProtectedRoute(path: string): boolean {
  return path.startsWith(ADMIN_PROTECTED_ROUTES)
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Si hay token, verificarlo primero
  if (token) {
    try {
      const payload = await verifyToken(token)
      if (payload) {
        const { role } = payload

        // Redirigir usuarios autenticados desde rutas de autenticación
        if (path === '/auth/signin' || path === '/signin' || path === '/register') {
          return NextResponse.redirect(new URL(role === 'admin' ? '/console/dashboard' : '/', request.url))
        }

        // Manejar acceso a rutas protegidas según el rol
        if (role === 'normal_user' && isAdminProtectedRoute(path)) {
          return NextResponse.redirect(new URL('/', request.url))
        }

        // Permitir acceso a admins a todas las rutas
        if (role === 'admin') {
          return NextResponse.next()
        }

        // Token válido para usuario normal, permitir acceso a rutas normales
        return NextResponse.next()
      }
    } catch (error) {
      // Token inválido, eliminar la cookie y redirigir a signin
      const response = NextResponse.redirect(new URL('/auth/signin', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  // Si no hay token
  // Permitir acceso a rutas de autenticación
  if (path === '/auth/signin' || path === '/signin' || path === '/register') {
    return NextResponse.next()
  }

  // Redirigir a signin si intenta acceder a rutas protegidas sin token
  if (isNormalUserProtectedRoute(path)) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if (isAdminProtectedRoute(path)) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Por defecto, permitir el acceso a rutas públicas
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}