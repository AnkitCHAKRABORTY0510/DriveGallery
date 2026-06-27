import { connectToDatabase } from '@/repositories/db';
import { User, IUser } from '@/models/User';
import { Logger } from '@/utils/logger';

interface SyncUserParams {
  googleId: string;
  email: string;
  displayName: string;
  avatar?: string;
}

export class AuthService {
  /**
   * Syncs a user profile from Google OAuth to MongoDB.
   * Creates a new user if one doesn't exist, or updates the existing one.
   */
  static async syncUser(params: SyncUserParams): Promise<IUser> {
    try {
      await connectToDatabase();

      let user = await User.findOne({ googleId: params.googleId });

      if (user) {
        // Update user profile if it changed
        user.displayName = params.displayName;
        user.email = params.email;
        if (params.avatar) user.avatar = params.avatar;
        
        await user.save();
        Logger.debug(`Updated existing user: ${user.username}`);
        return user;
      }

      // Generate a base username from the email
      let baseUsername = params.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (!baseUsername) baseUsername = 'user';

      let username = baseUsername;
      let counter = 1;

      // Ensure username is unique
      while (await User.exists({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        googleId: params.googleId,
        email: params.email,
        displayName: params.displayName,
        avatar: params.avatar,
        username,
      });

      Logger.info(`Created new user: ${username}`);
      return user;

    } catch (error) {
      Logger.error('Failed to sync user', error);
      throw new Error('Failed to synchronize user data');
    }
  }
}
