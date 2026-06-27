import { connectToDatabase } from '@/repositories/db';
import { User, IUser } from '@/models/User';

export class ProfileRepository {
  static async getUserById(id: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findById(id);
  }

  static async getUserByUsername(username: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOne({ username });
  }

  static async searchUsers(query: string): Promise<IUser[]> {
    await connectToDatabase();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    const isEmailQuery = trimmedQuery.includes('@');
    const searchQuery = isEmailQuery
      ? { email: trimmedQuery.toLowerCase() }
      : { username: { $regex: trimmedQuery, $options: 'i' } };

    return User.find(searchQuery).limit(8);
  }

  static async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return updatedUser;
  }
}
