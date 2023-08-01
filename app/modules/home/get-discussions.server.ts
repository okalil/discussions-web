import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  meta: z.object({ total: z.number() }),
  data: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullish(),
      user_voted: z.boolean().nullish(),
      votes_count: z.number(),
      comments_count: z.number(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        picture: z.object({ url: z.string() }).nullish(),
      }),
      created_at: z.string(),
    })
    .array(),
});

export const getDiscussions = async (token: string) => {
  const response = await requester.get('/api/v1/discussions', { token });
  return schema.parse(await response.json());
};
