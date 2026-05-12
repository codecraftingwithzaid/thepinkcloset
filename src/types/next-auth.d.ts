import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'customer' | 'staff';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'admin' | 'customer' | 'staff';
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'customer' | 'staff';
  }
}
