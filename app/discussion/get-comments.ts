import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  comments: z
    .object({
      id: z.number(),
      content: z.string(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        picture: z.object({ url: z.string() }).nullish(),
      }),
      created_at: z.string(),
      votes_count: z.number(),
      user_voted: z.boolean(),
    })
    .array(),
});

export const getComments = async (discussionId: any, token: any) => {
  const response = await requester.get(
    `/api/v1/discussions/${discussionId}/comments`,
    { token }
  );
  return schema.parse(await response.json());
};
