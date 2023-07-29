import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  discussion: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullish(),
    created_at: z.string(),
    user: z.object({
      id: z.number(),
      name: z.string(),
      picture: z.object({ url: z.string() }).nullish(),
    }),
    votes_count: z.number(),
    comments_count: z.number(),
    user_voted: z.boolean(),
  }),
});

export const getDiscussion = async (id?: string, token?: string) => {
  const response = await requester.get(`/api/v1/discussions/${id}`, { token });
  return schema.parse(await response.json());
};
