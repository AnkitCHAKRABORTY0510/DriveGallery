import { z } from 'zod';

export const updateGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

export type UpdateGalleryRequest = z.infer<typeof updateGallerySchema>;
