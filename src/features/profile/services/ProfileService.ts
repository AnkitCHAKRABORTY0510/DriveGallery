import { ProfileRepository } from '../repositories/ProfileRepository';
import { UpdateProfileRequest, UserProfile, PublicProfile, UserSearchResult } from '../types';
import { Logger } from '@/utils/logger';
import { IUser } from '@/models/User';

export class ProfileService {
  /**
   * Transforms a mongoose User document into a UserProfile for the client.
   */
  private static mapToUserProfile(user: IUser): UserProfile {
    return {
      id: (user._id as unknown as { toString: () => string }).toString(),
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Retrieves the current user profile by their ID.
   */
  static async getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await ProfileRepository.getUserById(userId);
      if (!user) return null;
      return this.mapToUserProfile(user);
    } catch (error) {
      Logger.error(`Error getting user profile for id: ${userId}`, error);
      throw new Error('Failed to retrieve user profile');
    }
  }

  /**
   * Updates the current user profile.
   */
  static async updateCurrentUserProfile(userId: string, data: UpdateProfileRequest): Promise<UserProfile | null> {
    try {
      const updatedUser = await ProfileRepository.updateUser(userId, data);
      if (!updatedUser) return null;
      return this.mapToUserProfile(updatedUser);
    } catch (error) {
      Logger.error(`Error updating user profile for id: ${userId}`, error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Retrieves a public profile by username.
   */
  static async getPublicProfile(username: string): Promise<PublicProfile | null> {
    try {
      const user = await ProfileRepository.getUserByUsername(username);
      if (!user) return null;

      return {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        gallery: [], // Stubbed for future phase
        collections: [], // Stubbed for future phase
        featured: [], // Stubbed for future phase
      };
    } catch (error) {
      Logger.error(`Error getting public profile for username: ${username}`, error);
      throw new Error('Failed to retrieve public profile');
    }
  }

  static async searchUsers(query: string): Promise<UserSearchResult[]> {
    try {
      const users = await ProfileRepository.searchUsers(query);
      return users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
      }));
    } catch (error) {
      Logger.error(`Error searching users with query: ${query}`, error);
      throw new Error('Failed to search users');
    }
  }
}
