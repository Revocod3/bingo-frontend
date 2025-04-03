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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.picture,
          is_staff: false, 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.is_staff = user.is_staff;
        
        if (account?.provider === 'google') {
          try {
            console.log("Google login - attempting backend integration");
            const response = await authService.googleLogin({
              email: user.email as string,
              name: user.name as string,
              google_id: user.id,
            });
            
            if (response && response.access) {
              token.accessToken = response.access;
              token.refreshToken = response.refresh;
              token.userId = String(response.user.id);
              token.is_staff = response.user.is_staff || false;
              token.accessTokenExpires = Date.now() + 55 * 60 * 1000;
              console.log("Google login - backend integration successful");
            } else {
              console.log("Google login - no tokens received from backend");
            }
          } catch (error) {
            console.error('Error al autenticar con Google en el backend:', error);
          }
        }
        
        token.accessTokenExpires = Date.now() + 55 * 60 * 1000;
      }
      
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
          token.accessTokenExpires = Date.now() + 55 * 60 * 1000;
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        return { ...token, error: 'RefreshTokenError' };
      }
      
      return token;
    },
    async session({ session, token }) {
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
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET || 'tu-secreto-super-seguro-para-nextauth',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
