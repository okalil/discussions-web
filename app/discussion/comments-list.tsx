import React from 'react';
import { useSocketEvent } from '~/ws/use-socket-event';
import { cn } from '~/lib/classnames';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import type { Loader } from './_layout.d.$id.route';

export function CommentsList({
  initialComments,
}: {
  initialComments: Awaited<ReturnType<Loader>>['comments'];
}) {
  const [comments, setComments] = React.useState(initialComments);

  useSocketEvent('comment_new', comment =>
    setComments(state => state.concat([{ ...comment, votes_count: 0 }]))
  );

  return (
    <ul>
      {comments.map(comment => {
        const formattedCreatedAt = new Intl.DateTimeFormat('en', {
          month: 'short',
          year: '2-digit',
          day: 'numeric',
        }).format(new Date(comment.created_at));
        return (
          <li key={comment.id} className="py-3 border-y border-gray-300 mb-4">
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
  );
}
