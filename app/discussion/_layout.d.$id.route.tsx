import type { DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, type V2_MetaFunction } from '@remix-run/react';
import { getDiscussion } from './get-discussion';
import { cn } from '~/lib/classnames';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import { getComments } from './get-comments';

export const loader = async ({ params }: DataFunctionArgs) => {
  const [{ discussion }, { comments }] = await Promise.all([
    getDiscussion(params.id),
    getComments(params.id),
  ]);
  return { discussion, comments };
};

export const meta: V2_MetaFunction = ({ data }) => [
  { title: data.discussion.title },
];

export default function DiscussionRoute() {
  const { discussion, comments } = useLoaderData<typeof loader>();

  const formattedCreatedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    day: 'numeric',
  }).format(new Date(discussion.created_at));

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
          {discussion.comments_count} comments
        </h2>

        <ul>
          {comments.map(comment => {
            const formattedCreatedAt = new Intl.DateTimeFormat('en', {
              month: 'short',
              year: '2-digit',
              day: 'numeric',
            }).format(new Date(comment.created_at));
            return (
              <li
                key={comment.id}
                className="py-3 border-y border-gray-300 mb-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={'http://localhost:3333' + comment.user.picture}
                    alt={comment.user.name}
                    className="h-10 rounded-full"
                  />
                  <span className="font-semibold">{comment.user.name}</span>
                  <span className="text-gray-500">{formattedCreatedAt}</span>
                </div>

                <div className="mb-3">{comment.content}</div>

                <div className="flex items-center justify-end">
                  <button
                    className={cn(
                      'flex items-center gap-2 rounded-xl',
                      'px-2 py-1 border border-gray-200',
                      'cursor-default hover:bg-gray-50 hover:text-blue-500'
                    )}
                    aria-label={`${comment.votes_count} votos`}
                  >
                    <ArrowUpIcon size={16} />
                    {comment.votes_count}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
