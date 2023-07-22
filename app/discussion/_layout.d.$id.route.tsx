import { redirect, type DataFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, type V2_MetaFunction } from '@remix-run/react';
import React from 'react';

import { getToken } from '~/auth/auth.server';
import { requester } from '~/lib/requester';
import { handleActionError } from '~/lib/handle-action-error.server';
import { Button } from '~/components/button';
import { cn } from '~/lib/classnames';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import { getDiscussion } from './get-discussion';
import { getComments } from './get-comments';
import { socket } from '~/ws/socket.client';
import { CommentsCount } from './comments-count';
import { CommentsList } from './comments-list';

export const action = async ({ request, params }: DataFunctionArgs) => {
  try {
    const token = await getToken(request);
    const body = new URLSearchParams(await request.text());
    await requester.post(`/api/v1/discussions/${params.id}/comments`, {
      body,
      headers: { Authorization: `Bearer ${token}` },
    });
    return redirect(request.url);
  } catch (error) {
    return handleActionError({ error, request });
  }
};

export const loader = async ({ params }: DataFunctionArgs) => {
  const [{ discussion }, { comments }] = await Promise.all([
    getDiscussion(params.id),
    getComments(params.id),
  ]);
  return { discussion, comments };
};

export type Loader = typeof loader;

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.discussion.title },
];

export default function DiscussionRoute() {
  const { discussion, comments } = useLoaderData<typeof loader>();

  const formattedCreatedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    day: 'numeric',
  }).format(new Date(discussion.created_at));

  React.useEffect(() => {
    socket.emit('discussion_subscribe', discussion.id);
    return () => {
      socket.emit('discussion_unsubscribe');
    };
  }, [discussion.id]);

  return (
    <main className="max-w-4xl mx-auto px-3 py-3">
      <h1 className="text-xl font-semibold mb-2">{discussion.title}</h1>

      <section className="py-3 border-y border-gray-300 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={'http://localhost:3333' + discussion.user.picture}
            alt={discussion.user.name}
            className="h-10 rounded-full"
          />
          <span className="font-semibold">{discussion.user.name}</span>
          <span className="text-gray-500">{formattedCreatedAt}</span>
        </div>

        <div className="mb-3">{discussion.description}</div>

        <div className="flex items-center justify-end">
          <button
            className={cn(
              'flex items-center gap-2 rounded-xl',
              'px-2 py-1 border border-gray-200',
              'cursor-default hover:bg-gray-50 hover:text-blue-500'
            )}
            aria-label={`${discussion.votes_count} votos`}
          >
            <ArrowUpIcon size={16} />
            {discussion.votes_count}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">
          <CommentsCount defaultCount={discussion.comments_count} />
        </h2>

        <CommentsList initialComments={comments} />
      </section>

      <hr />

      <Form method="POST">
        <textarea name="content" />
        <Button variant="primary">Comentar</Button>
      </Form>
    </main>
  );
}
