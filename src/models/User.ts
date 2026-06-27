import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

// Mongoose model caching for Next.js hot reloads
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
