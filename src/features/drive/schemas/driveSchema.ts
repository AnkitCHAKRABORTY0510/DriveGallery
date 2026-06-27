import { z } from 'zod';

export const publishRequestSchema = z.object({
  files: z.array(z.string()).min(1, "At least one file must be selected"),
  collectionId: z.string().optional(),
});

export const unpublishRequestSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
});
