import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { useSocketEvent } from '~/ws/use-socket-event';
import type { Loader } from './_layout.d.$id.route';
import { CommentVote } from './comment-vote';
import { Avatar } from '~/components/avatar';

export function CommentsList() {
  const data = useLoaderData<Loader>();

  const [comments, setComments] = React.useState(data.comments);

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
              <Avatar
                src={comment.user.picture?.url}
                alt={comment.user.name}
                size={40}
              />
              <span className="font-semibold">{comment.user.name}</span>
              <span className="text-gray-500">{formattedCreatedAt}</span>
            </div>

            <div className="mb-3">{comment.content}</div>

            <CommentVote discussion={data.discussion} comment={comment} />
          </li>
        );
      })}
    </ul>
  );
}
