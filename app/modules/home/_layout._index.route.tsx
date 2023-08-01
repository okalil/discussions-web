import type { V2_MetaFunction } from '@remix-run/react';
import { Form, useLoaderData, useMatches } from '@remix-run/react';
import type { DataFunctionArgs } from '@remix-run/node';

import { Button } from '~/components/button';
import { getDiscussions } from './get-discussions.server';
import { Discussion } from './discussion';
import { getSessionManager } from '~/session.server';

export const meta: V2_MetaFunction = () => [
  { title: 'Top discussions | Community' },
];
export const loader = async ({ request }: DataFunctionArgs) => {
  const session = await getSessionManager(request);
  return getDiscussions(session.get('token'));
};

export type Loader = typeof loader;

export default function DiscussionsRoute() {
  const paginator = useLoaderData<typeof loader>();

  const [root] = useMatches();
  const hasUser = !!root.data?.token;

  return (
    <div className="px-3 py-3 max-w-4xl mx-auto">
      <div className="flex justify-between h-10 mb-2">
        <h2 className="text-lg font-semibold">Discussões</h2>
        {hasUser && (
          <Form action="/d/new">
            <Button variant="primary" className="h-full">
              Nova discussão
            </Button>
          </Form>
        )}
      </div>
      <ul>
        {paginator.data.map(it => (
          <Discussion key={it.id} discussion={it} />
        ))}
      </ul>
    </div>
  );
}
