import type { V2_MetaFunction } from '@remix-run/react';
import { Form, useLoaderData } from '@remix-run/react';
import type { DataFunctionArgs } from '@remix-run/node';

import { Button } from '~/components/button';
import { getDiscussions } from './get-discussions.server';
import { Discussion } from './discussion';
import { getSessionStorage } from '~/session.server';
import { getToken } from '~/modules/auth/auth.server';

export const meta: V2_MetaFunction = () => [
  { title: 'Top discussions | Community' },
];
export const loader = async ({ request }: DataFunctionArgs) => {
  const storage = await getSessionStorage(request);
  return getDiscussions(getToken(storage.session));
};

export type Loader = typeof loader;

export default function DiscussionsRoute() {
  const paginator = useLoaderData<typeof loader>();

  return (
    <div className="px-3 py-3 max-w-4xl mx-auto">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Discussões</h2>
        <Form action="/d/new">
          <Button variant="primary">Nova discussão</Button>
        </Form>
      </div>
      <ul>
        {paginator.data.map(it => (
          <Discussion key={it.id} discussion={it} />
        ))}
      </ul>
    </div>
  );
}
