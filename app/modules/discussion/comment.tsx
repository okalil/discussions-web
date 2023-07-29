import React from 'react';
import {
  Form,
  useFormAction,
  useLoaderData,
  useMatches,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Loader } from './_layout.d.$id.route';
import { CommentVote } from './comment-vote';
import { Avatar } from '~/components/avatar';
import { cn } from '~/lib/classnames';
import type { LayoutLoader } from '../layout/_layout.route';
import { FormTextarea } from '~/components/forms/form-textarea';
import { Button } from '~/components/button';
import { AlertModal } from '~/components/alert-modal';
import { requester } from '~/lib/requester';
import { Popover } from '~/components/popover';

interface CommentProps {
  comment: Awaited<ReturnType<Loader>>['comments'][number];
  onDelete?: (commentId: number) => void;
}

export function Comment({ comment, onDelete }: CommentProps) {
  const user = useMatches()[1].data as Awaited<ReturnType<LayoutLoader>>;
  const data = useLoaderData<Loader>();

  const formattedCreatedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    day: 'numeric',
  }).format(new Date(comment.created_at));
  const isDiscussionAuthor = data.discussion.user.id === comment.user.id;
  const isUserComment = user?.id === comment.user.id;

  const form = useForm({ defaultValues: comment });
  const submit = useSubmit();
  const loading = useFormAction() === useNavigation().formAction;
  const [editing, setEditing] = React.useState(false);

  if (editing) {
    return (
      <li className="mb-4">
        <FormProvider {...form}>
          <Form
            method="POST"
            onSubmit={form.handleSubmit((_, e) => {
              submit(e?.target, { preventScrollReset: true });
              setEditing(false);
            })}
            className={cn(
              'bg-gray-50 px-3 py-3',
              'border border-gray-300 rounded-md'
            )}
          >
            <input type="hidden" name="id" value={comment.id} />
            <FormTextarea
              label="Write"
              className="mb-3"
              name="content"
              rows={4}
              rules={{ required: 'Preencha o campo' }}
            />

            <div className="flex gap-2">
              <Button
                variant="danger"
                className="h-10 w-24 ml-auto"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="h-10 w-48"
                disabled={!form.watch('content')}
                loading={loading}
              >
                Atualizar comentário
              </Button>
            </div>
          </Form>
        </FormProvider>
      </li>
    );
  }

  return (
    <li
      id={`comment-${comment.id}`}
      className={cn(
        'py-3 px-3 border-y border-gray-300 mb-4',
        'target:border-x target:rounded target:border-blue-500'
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-3">
          <Avatar
            src={comment.user.picture?.url}
            alt={comment.user.name}
            size={40}
          />
          <span className="font-semibold">{comment.user.name}</span>
          <span className="text-gray-500">{formattedCreatedAt}</span>

          {isDiscussionAuthor && (
            <span
              className={cn(
                'px-2 rounded-lg bg-gray-50',
                'border border-gray-300',
                'font-semibold text-sm'
              )}
            >
              Author
            </span>
          )}
        </div>

        {isUserComment && (
          <div>
            <Popover
              trigger={
                <button
                  type="button"
                  aria-label="Comment options"
                  title="Comment options"
                  className="grid place-items-center px-2 rounded-md hover:bg-gray-100"
                >
                  ...
                </button>
              }
            >
              <div className="grid gap-2 text-sm">
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      window.location.href.concat(`#comment-${comment.id}`)
                    )
                  }
                  className="px-2 py-1 text-left rounded hover:bg-gray-200"
                >
                  Copiar link
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-2 py-1 text-left rounded hover:bg-gray-200"
                >
                  Editar
                </button>
                <AlertModal
                  title="Delete comment"
                  description="Are you sure you want to delete this comment?"
                  trigger={
                    <button
                      type="button"
                      className="px-2 py-1 text-left rounded "
                    >
                      Deletar
                    </button>
                  }
                  action={
                    <Form
                      method="POST"
                      onSubmit={e => {
                        e.preventDefault();
                        requester.delete(
                          `/api/v1/discussions/${data.discussion.id}/comments/${comment.id}`
                        );
                        onDelete?.(comment.id);
                      }}
                    >
                      <Button variant="danger">Delete comment</Button>
                    </Form>
                  }
                />
              </div>
            </Popover>
          </div>
        )}
      </div>

      <div className="mb-3">{comment.content}</div>

      <CommentVote discussion={data.discussion} comment={comment} />
    </li>
  );
}
