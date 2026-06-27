import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50).optional(),
  bio: z.string().max(160, 'Bio must be at most 160 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
