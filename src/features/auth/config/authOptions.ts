import { NextAuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/config/env';
import { AuthService } from '@/features/auth/services/AuthService';
import { Logger } from '@/utils/logger';

// Extend NextAuth Session to include custom properties
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid profile email https://www.googleapis.com/auth/drive',
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          // Sync Google profile to our MongoDB users collection
          await AuthService.syncUser({
            googleId: profile.sub || account.providerAccountId,
            email: user.email!,
            displayName: user.name || 'Unknown',
            avatar: user.image || undefined,
          });
          return true;
        } catch (error) {
          Logger.error('Error during signIn callback', error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, account, user }) {
      if (account) {
        // Optionally store the Google Access Token if we need to call Google APIs directly
        token.accessToken = account.access_token;
      }
      
      // We can also fetch the custom username from MongoDB here to embed into the token,
      // but to save DB calls, we can either do it at sign in or just keep the basic info.
      // Let's populate the custom user ID and username by looking up the DB once
      if (user && user.email) {
        // Lazy load the DB call to attach internal user ID to token
        // In a real app we might cache this
        try {
          const { connectToDatabase } = await import('@/repositories/db');
          const { User } = await import('@/models/User');
          
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email }).lean();
          
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.username = dbUser.username;
          }
        } catch (e) {
          Logger.error('Error fetching user data for JWT', e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
