import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import { z } from 'zod';

// TODO: validate this is our error schema for API
export const humanloopErrorDataSchema = z.object({
  object: z.literal('error'),
  message: z.string(),
  type: z.string(),
  param: z.string().nullable(),
  code: z.string().nullable(),
});

export type HumanloopErrorData = z.infer<typeof humanloopErrorDataSchema>;

export const humanloopFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: humanloopErrorDataSchema,
  errorToMessage: data => data.message,
});