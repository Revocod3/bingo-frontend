import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authService } from '@/lib/api/services';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await authService.login({
            email: credentials?.email || '',
            password: credentials?.password || '',
          });
          
          if (response && response.access) {
            const email = credentials?.email || '';
            return {
              id: String(response.user.id || 'unknown'),
              email: email,
              accessToken: response.access,
              refreshToken: response.refresh,
              is_staff: response.user.is_staff || false,
              name: response.user.first_name || response.user.last_name || 'unknown',
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        // Cuando el usuario se acaba de autenticar, guardamos los tokens y datos del usuario en el JWT
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.is_staff = user.is_staff;
        // Inicializar el tiempo de expiración cuando el usuario se autentica
        token.accessTokenExpires = Date.now() + 55 * 60 * 1000; // 55 minutos en milisegundos
      }
      
      // Aquí puedes añadir lógica para refrescar el token si ha expirado
      // Por ejemplo:
      
      // Verificar si accessTokenExpires existe y si aún no ha expirado
      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }
      
      try {
        if (!token.refreshToken) {
          return { ...token, error: 'RefreshTokenError' };
        }
        const response = await authService.refreshToken(token.refreshToken);
        if (response.access) {
          token.accessToken = response.access;
          token.accessTokenExpires = Date.now() + 55 * 60 * 1000; // Ajustar según tu tiempo de expiración
        }
      } catch (error) {
        // Si falla el refresh, se fuerza al usuario a iniciar sesión de nuevo
        console.error('Token refresh error:', error);
        return { ...token, error: 'RefreshTokenError' };
      }
      
      
      return token;
    },
    async session({ session, token }) {
      // Pasamos los tokens y datos del usuario a la sesión
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = {
        id: token.userId || 'unknown',
        email: token.email || '',
        name: token.name || 'unknown',
        is_staff: token.is_staff || false,
      };
      
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error'
  },
  // Estas opciones son importantes para la seguridad
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET || 'tu-secreto-super-seguro-para-nextauth',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
