import { z } from 'zod';
import { requester } from '~/lib/requester';

const schema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
    picture: z.string().nullish(),
    name: z.string(),
  }),
});

export const getUser = async (token: string) => {
  const response = await requester.get('/api/v1/profile', {
    headers: { Authorization: 'Bearer ' + token },
  });
  return schema.parse(await response.json()).user;
};
