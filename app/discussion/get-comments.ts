import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  comments: z
    .object({
      id: z.number(),
      content: z.string(),
      user: z.object({ id: z.number(), name: z.string(), picture: z.string().nullish() }),
      created_at: z.string(),
      votes_count: z.number(),
    })
    .array(),
});

export const getComments = async (discussionId: any) => {
  const response = await requester.get(
    `/api/v1/discussions/${discussionId}/comments`
  );
  return schema.parse(await response.json());
};
