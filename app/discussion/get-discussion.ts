import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  discussion: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullish(),
    created_at: z.string(),
    user: z.object({ id: z.number(), name: z.string(), picture: z.string().nullish() }),
    votes_count: z.number(),
    comments_count: z.number(),
  }),
});

export const getDiscussion = async (id: any) => {
  const response = await requester.get(`/api/v1/discussions/${id}`);
  return schema.parse(await response.json());
};
