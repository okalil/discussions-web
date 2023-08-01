import { redirect, type DataFunctionArgs } from '@remix-run/node';
import {
  Form,
  useFormAction,
  useLoaderData,
  useNavigation,
  useSubmit,
  type V2_MetaFunction,
} from '@remix-run/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { requester } from '~/lib/requester';
import { handleActionError } from '~/lib/handle-action-error.server';
import { Button } from '~/components/button';
import { getDiscussion } from './get-discussion';
import { getComments } from './get-comments';
import { socket } from '~/ws/socket.client';
import { CommentsCount } from './comments-count';
import { CommentsList } from './comments-list';
import { getSessionManager } from '~/session.server';
import { Avatar } from '~/components/avatar';
import { DiscussionVote } from '~/modules/home/discussion-vote';
import { cn } from '~/lib/classnames';
import { FormTextarea } from '~/components/forms/form-textarea';

export const action = async ({ request, params }: DataFunctionArgs) => {
  try {
    const session = await getSessionManager(request);
    const token = session.get('token');
    const body = new URLSearchParams(await request.text());
    const commentId = body.get('id');
    if (commentId) {
      await requester.put(
        `/api/v1/discussions/${params.id}/comments/${commentId}`,
        { body, token }
      );
    } else {
      await requester.post(`/api/v1/discussions/${params.id}/comments`, {
        body,
        token,
      });
    }
    return redirect('.');
  } catch (error) {
    return handleActionError({ error, request });
  }
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const session = await getSessionManager(request);
  const token = session.get('token');
  const [{ discussion }, { comments }] = await Promise.all([
    getDiscussion(params.id, token),
    getComments(params.id, token),
  ]);
  return { discussion, comments };
};

export type Loader = typeof loader;

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.discussion.title },
];

export default function DiscussionRoute() {
  const { discussion } = useLoaderData<typeof loader>();

  const formattedCreatedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    day: 'numeric',
  }).format(new Date(discussion.created_at));

  React.useEffect(() => {
    socket.emit('discussion_subscribe', discussion.id);
    return () => {
      socket.emit('discussion_unsubscribe', discussion.id);
    };
  }, [discussion.id]);

  return (
    <main className="max-w-4xl mx-auto px-3 py-3">
      <h1 className="text-xl font-semibold mb-2">{discussion.title}</h1>

      <section className="py-3 border-y border-gray-300 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar
            src={discussion.user.picture?.url}
            alt={discussion.user.name}
            size={40}
          />
          <span className="font-semibold">{discussion.user.name}</span>
          <span className="text-gray-500">{formattedCreatedAt}</span>
        </div>

        <div className="mb-3">{discussion.description}</div>

        <DiscussionVote discussion={discussion} />
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-3">
          <CommentsCount defaultCount={discussion.comments_count} />
        </h2>

        <CommentsList />
      </section>

      <CreateComment />
    </main>
  );
}

function CreateComment() {
  const form = useForm();
  const submit = useSubmit();
  const loading = useFormAction() === useNavigation().formAction;

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  return (
    <FormProvider {...form}>
      <Form
        method="POST"
        onSubmit={form.handleSubmit((_, e) => {
          submit(e?.target, { preventScrollReset: true });
          form.reset();
        })}
        className={cn(
          'px-3 py-3',
          'border border-gray-300 rounded-md'
        )}
      >
        <FormTextarea
          label="Write"
          className="mb-3"
          name="content"
          rows={4}
          rules={{ required: 'Preencha o campo' }}
        />
        <Button
          variant="primary"
          className="h-10 w-24 ml-auto"
          disabled={hydrated && !form.watch('content')} // disable if js loaded but comment is empty
          loading={loading}
        >
          Comentar
        </Button>
      </Form>
    </FormProvider>
  );
}

// comments list will be updated by socket, so revalidation is unnecessary
export const shouldRevalidate = () => !socket.connected;
