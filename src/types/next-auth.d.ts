import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extiende el tipo User por defecto
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
    is_staff?: boolean;
  }

  /**
   * Extiende el objeto Session por defecto
   */
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      is_staff: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Extiende el objeto JWT por defecto */
  interface JWT {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    is_staff?: boolean;
    error?: string;
  }
}
