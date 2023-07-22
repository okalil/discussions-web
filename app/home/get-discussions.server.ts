import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  meta: z.object({ total: z.number() }),
  data: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullish(),
      votes_count: z.number(),
      comments_count: z.number(),
      user: z.object({ id: z.number(), name: z.string(), picture: z.string() }),
      created_at: z.string(),
    })
    .array(),
});

export const getDiscussions = async () => {
  const response = await requester.get('/api/v1/discussions');
  const data = schema.parse(await response.json());
  return data;
};
