import { z } from 'zod';

const visibilitySchema = z.enum(['public', 'private', 'unlisted']);
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

export const createCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  visibility: visibilitySchema.optional(),
  joinApprovalRequired: z.boolean().optional(),
});

export const updateCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters').optional(),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  visibility: visibilitySchema.optional(),
  coverPhotoId: objectIdSchema.optional(),
  joinApprovalRequired: z.boolean().optional(),
});

export const joinCollectionSchema = z.object({
  inviteCode: z.string().min(4, 'Invite code is required').max(32, 'Invite code is too long'),
});

export const reviewJoinRequestSchema = z.object({
  requestId: objectIdSchema,
  action: z.enum(['approve', 'reject']),
});

export type CreateCollectionRequest = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionRequest = z.infer<typeof updateCollectionSchema>;
export type JoinCollectionRequest = z.infer<typeof joinCollectionSchema>;
export type ReviewJoinRequest = z.infer<typeof reviewJoinRequestSchema>;
